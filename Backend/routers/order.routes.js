const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../Controllers/order.controller');

// Create new order
router.post('/', authMiddleware, createOrder);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getUserOrders);

// Get specific order by ID
router.get('/:orderId', authMiddleware, getOrderById);

// Update order status (Admin only)
router.patch('/:orderId/status', authMiddleware, adminMiddleware, updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', authMiddleware, cancelOrder);

module.exports = router; 