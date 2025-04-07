const Reviews = require("../models/reviews.model.js");
const Book = require("../models/book.model.js");
const User = require("../models/user.model.js");
const { createError } = require("../utils/error.js");
const { sendEmail } = require("../config/nodemailer.js");
const ejs = require("ejs");
const path = require("path");
const NotificationService = require('../services/notification.service');

// Create a new review
const createReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return next(createError(404, "Book not found"));
    }

    // Check if user has already reviewed this book
    const existingReview = await Reviews.findOne({
      user: userId,
      book: bookId,
    });

    if (existingReview) {
      return next(createError(400, "You have already reviewed this book"));
    }

    // Create new review
    const newReview = new Reviews({
      user: userId,
      book: bookId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    // Add review to book's reviews array
    book.reviews.push(savedReview._id);
    await book.save();

    // Populate user details before sending response
    const populatedReview = await Reviews.findById(savedReview._id)
      .populate("user", "name profilePicture")
      .populate("book", "title");

    // Send email notification to admin
    try {
      const templatePath = path.join(__dirname, '../views/emails/newReviewNotification.ejs');
      const html = await ejs.renderFile(templatePath, { review: populatedReview });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Book Review Received',
        html
      };

      await sendEmail(mailOptions);
      console.log('Review notification email sent to admin');
    } catch (emailError) {
      console.error('Error sending review notification email:', emailError);
      // Don't throw error, just log it - we don't want to fail the review submission if email fails
    }

    // Send notification if enabled
    await NotificationService.notifyNewReview(savedReview);

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    next(error);
  }
};

// Get all reviews for a book
const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const reviews = await Reviews.find({ book: bookId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
};

// Update a review
const updateReview = async (req, res, next) => {
  try {
    const { reviewId, bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Reviews.findById(reviewId);
    if (!review) {
      return next(createError(404, "Review not found"));
    }

    // Check if user is the author of the review
    if (review.user.toString() !== userId) {
      return next(createError(403, "You can only update your own reviews"));
    }

    const updatedReview = await Reviews.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    ).populate("user", "name profilePicture");

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    next(error);
  }
};

// Delete a review
const deleteReview = async (req, res, next) => {
  try {
    const { reviewId, bookId } = req.params;
    const userId = req.user.id;

    const review = await Reviews.findById(reviewId);
    if (!review) {
      return next(createError(404, "Review not found"));
    }

    // Check if user is the author of the review
    if (review.user.toString() !== userId) {
      return next(createError(403, "You can only delete your own reviews"));
    }

    // Remove review from book's reviews array
    await Book.findByIdAndUpdate(bookId, {
      $pull: { reviews: reviewId },
    });

    await Reviews.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    next(error);
  }
};

module.exports = {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
}; 