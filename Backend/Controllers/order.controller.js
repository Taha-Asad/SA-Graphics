const Order = require("../models/Order.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { sendEmail } = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");
const createError = require('http-errors');

// Create Order
const createOrder = async (req, res, next) => {
  try {
    const { item, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!item || !item.length || !totalAmount || !shippingAddress || !paymentMethod) {
      throw createError(400, 'Please provide all required order details');
    }

    // Validate and process each item
    const orderItems = [];
    for (const orderItem of item) {
      const book = await Book.findById(orderItem.bookId);
      if (!book) {
        throw createError(404, `Book with ID ${orderItem.bookId} not found`);
      }
      if (book.countInStock < orderItem.quantity) {
        throw createError(400, `Insufficient stock for ${book.title}`);
      }

      // Update book stock
      book.countInStock -= orderItem.quantity;
      await book.save();

      orderItems.push({
        bookId: book._id,
        title: book.title,
        image: book.image,
        quantity: orderItem.quantity,
        price: orderItem.price
      });
    }

    // Create the order
    const order = new Order({
      userId: req.user._id,
      item: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending'
    });

    const savedOrder = await order.save();

    // Send confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        const emailTemplate = path.join(__dirname, '../views/emails/orderConfirmation.ejs');
        const html = await ejs.renderFile(emailTemplate, {
          order: savedOrder,
          user: user
        });

        await sendEmail({
          to: user.email,
          subject: `Order Confirmation - Order #${savedOrder._id}`,
          html
        });
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't throw error here, just log it
    }
    
    // Populate the book details for the response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate({
        path: 'item.bookId',
        model: 'Book',
        select: 'title image price'
      });
    
    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: {
        order: populatedOrder
      }
    });
  } catch (error) {
    // If there's an error, we should restore the book stock
    if (error.statusCode !== 404) { // Don't attempt restore for non-existent books
      try {
        for (const orderItem of req.body.item || []) {
          const book = await Book.findById(orderItem.bookId);
          if (book) {
            book.countInStock += orderItem.quantity;
            await book.save();
          }
        }
      } catch (restoreError) {
        console.error('Error restoring book stock:', restoreError);
      }
    }
    next(error);
  }
};

// Process Payment
const processPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw createError(404, "Order not found");

    order.paymentStatus = "completed";
    await order.save();

    res.json({ 
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
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
    order.trackingUpdates.push({
      status,
      message: message || `Order ${status}`
    });

    const updatedOrder = await order.save();

    res.json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get User Orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: 'item.bookId',
        model: 'Book',
        select: 'title image price'
      })
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: 'item.bookId',
        model: 'Book',
        select: 'title image price'
      });
    
    if (!order) {
      throw createError(404, 'Order not found');
    }

    // Check if the order belongs to the requesting user
    if (order.userId.toString() !== req.user._id.toString()) {
      throw createError(403, 'Not authorized to view this order');
    }

    res.json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error in getOrderById:', error);
    next(error);
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
    for (const item of order.item) {
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
  processPayment,
  updateOrderStatus,
  getUserOrders,
  getOrderById,
  cancelOrder
};