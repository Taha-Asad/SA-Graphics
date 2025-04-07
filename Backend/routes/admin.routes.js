const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getAllContact, deleteContact } = require('../Controllers/contact.controller');

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

// Contact management routes
router.get('/contacts', getAllContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router; 