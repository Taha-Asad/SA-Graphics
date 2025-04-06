const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(isAdmin);

// Order management routes
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);
router.delete('/orders/:orderId', adminController.deleteOrder);
router.get('/orders/stats', adminController.getOrderStats);

// Review management routes
router.get('/reviews', adminController.getAllReviews);
router.patch('/reviews/:reviewId/status', adminController.updateReviewStatus);
router.delete('/reviews/:reviewId', adminController.deleteReview);

module.exports = router; 