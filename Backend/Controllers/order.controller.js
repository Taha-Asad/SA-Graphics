const Order = require("../models/order.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { sendEmail } = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");
const createError = require('http-errors');
const NotificationService = require('../services/notification.service');
const fs = require('fs');
const Joi = require('joi');
const { orderSchema, validateOrder } = require('../validations/orderValidation');
const mongoose = require('mongoose');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { sendOrderNotification } = require('../services/adminNotificationService');

// Create Order
const createOrder = async (req, res) => {
  try {
    console.log('Received order request:', req.body);
    
    let orderData;
    if (req.file) {
      // If there's a file upload, the order data is in the 'order' field as a string
      orderData = JSON.parse(req.body.order);
      // Store just the filename, not the full path
      orderData.transferProof = req.file.filename;
      console.log('Payment proof file:', {
        filename: req.file.filename,
        path: req.file.path
      });
    } else {
      // If no file, the order data is directly in the body
      orderData = req.body;
    }

    // Validate order data
    const { error } = validateOrder(orderData);
    if (error) {
      // If there was a file uploaded but validation failed, delete it
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    // Check if payment proof is required
    if (orderData.paymentMethod !== 'cash' && !orderData.transferProof) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment proof is required for non-cash payments'
      });
    }
    
    // Determine order type based on items
    const orderType = orderData.items.some(item => item.type === 'course') ? 'course' : 'product';
    orderData.orderType = orderType;

    // Add order number
    orderData.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create new order
    const order = new Order(orderData);
    await order.save();

    // Send admin notification
    await sendOrderNotification(order);

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        ...order.toObject(),
        orderId: order._id
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order,
        isCourseOrder: orderType === 'course'
      }
    });
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    console.error('Order creation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create order'
    });
  }
};

// Verify payment
const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Update payment status
    order.paymentStatus = status;
    if (status === 'verified') {
      order.status = 'processing';
    }
    await order.save();

    // Get user details for email
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Send status update email
    const emailSubject = 'Payment Verification Update - SA Graphics';
    const emailText = `
      Dear ${user.name},
      
      Your payment for Order #${order._id} has been ${status}.
      
      Order Details:
      - Order ID: ${order._id}
      - Total Amount: Rs. ${order.totalAmount}
      - Payment Method: ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Transfer'}
      - Status: ${order.status}
      
      ${status === 'verified' ? 'Your order is now being processed and will be shipped soon.' : 'Please contact our support team for assistance.'}
      
      Best regards,
      SA Graphics Team
    `;

    await sendEmail(user.email, emailSubject, emailText);

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    next(error);
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders'
    });
  }
};

// Get a single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this order'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order'
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw createError(404, 'Order not found');
    }

    order.status = status;
    if (!order.trackingUpdates) {
      order.trackingUpdates = [];
    }
    order.trackingUpdates.push({
      status,
      message: message || `Order ${status}`
    });

    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    next(error);
  }
};

// Get Order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'name email'); // Only populate user info
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Allow admin users to view any order
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw createError(404, 'Order not found');
    }

    // Check if the order belongs to the requesting user
    if (order.userId.toString() !== req.user._id.toString()) {
      throw createError(403, 'Not authorized to cancel this order');
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      throw createError(400, 'Cannot cancel order that is already being processed');
    }

    // Restore book stock
    for (const item of order.items) {
      const book = await Book.findById(item.bookId);
      if (book) {
        book.countInStock += item.quantity;
        await book.save();
      }
    }

    order.status = 'cancelled';
    if (!order.trackingUpdates) {
      order.trackingUpdates = [];
    }
    order.trackingUpdates.push({
      status: 'cancelled',
      message: 'Order cancelled by user'
    });

    const updatedOrder = await order.save();

    res.json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Error in cancelOrder:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  updateOrderStatus,
  getUserOrders,
  getOrder,
  getOrderById,
  cancelOrder
};