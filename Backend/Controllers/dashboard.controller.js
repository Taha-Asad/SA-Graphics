const mongoose = require('mongoose');
const User = require('../models/user.model.js');
const Review = require('../models/reviews.model.js');
const Testimonial = require('../models/testimonial.model.js');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from different collections
    const usersCount = await User.countDocuments();
    const ordersCount = await mongoose.model('Order').countDocuments();
    const reviewsCount = await Review.countDocuments();
    const testimonialsCount = await Testimonial.countDocuments();

    // Return all stats
    res.json({
      users: usersCount,
      orders: ordersCount,
      reviews: reviewsCount,
      testimonials: testimonialsCount
    });
  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
}; 