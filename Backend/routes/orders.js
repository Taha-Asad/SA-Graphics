const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const protect = require('../middleware/admin');
const { upload, handleMulterError } = require('../config/multer');
const {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../Controllers/order.controller.js');

// Create a new order
router.post('/', verifyToken, upload.single('transferProof'), handleMulterError, createOrder);

// Verify payment (Admin only)
router.patch('/:orderId/verify-payment', protect, verifyPayment);

// Get all orders for the logged-in user
router.get('/my-orders', verifyToken, getUserOrders);

// Get a single order
router.get('/:orderId', verifyToken, getOrder);

// Update order status (Admin only)
router.patch('/:orderId/status', protect, updateOrderStatus);

// Cancel order
router.patch('/:orderId/cancel', verifyToken, cancelOrder);

module.exports = router; 