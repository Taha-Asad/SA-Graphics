const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/user.model');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../config/nodemailer');
const ejs = require('ejs');
const path = require('path');

// Get all reviews for the current user
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide both rating and comment' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      user: req.user.id,
      rating,
      comment
    });

    const savedReview = await review.save();

    // Populate user details for email
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'name email');

    // Send email notification to admin
    try {
      const templatePath = path.join(__dirname, '../views/emails/newReviewNotification.ejs');
      const html = await ejs.renderFile(templatePath, { review: populatedReview });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New General Review Received',
        html
      };

      await sendEmail(mailOptions);
      console.log('Review notification email sent to admin');
    } catch (emailError) {
      console.error('Error sending review notification email:', emailError);
      // Don't throw error, just log it - we don't want to fail the review submission if email fails
    }

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.updatedAt = Date.now();

    await review.save();
    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 