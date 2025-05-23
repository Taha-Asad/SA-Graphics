const express = require('express');
const router = express.Router();
const testimonialController = require('../Controllers/testimonials.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/approved', testimonialController.getApprovedTestimonials);

// User routes (requires authentication)
router.post('/submit', verifyToken, testimonialController.submitTestimonial);

// Admin routes
router.get('/all', verifyToken, isAdmin, testimonialController.getAllTestimonials);
router.patch('/:id/approve', verifyToken, isAdmin, async (req, res) => {
    req.body.status = 'approved';
    await testimonialController.updateTestimonialStatus(req, res);
});
router.patch('/:id/reject', verifyToken, isAdmin, async (req, res) => {
    req.body.status = 'rejected';
    await testimonialController.updateTestimonialStatus(req, res);
});
router.delete('/:id', verifyToken, isAdmin, testimonialController.deleteTestimonial);

module.exports = router; 