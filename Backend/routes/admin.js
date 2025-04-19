const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder,
  getOrderStats
} = require('../Controllers/admin.controller');

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Order management routes
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId/status', updateOrderStatus);
router.delete('/orders/:orderId', deleteOrder);
router.get('/orders/stats', getOrderStats);

module.exports = router; 