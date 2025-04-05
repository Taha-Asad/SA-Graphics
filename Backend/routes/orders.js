const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const auth = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

// Create a new order (checkout)
router.post('/', auth, async (req, res) => {
  try {
    const { userId, item, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!item || !item.length || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required order details'
      });
    }

    // Create the order with the user ID from the authenticated user
    const order = new Order({
      userId: req.user._id, // Use the authenticated user's ID
      item,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Send confirmation emails
    const emailSent = await sendOrderConfirmationEmail(req.user.email, order);

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: {
        order,
        emailSent
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order'
    });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
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
});

// Get single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.json({
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
});

module.exports = router; 