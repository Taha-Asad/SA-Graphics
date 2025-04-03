const express = require("express");
const router = express.Router();
const {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
} = require("../Controllers/reviews.controller.js");
const { verifyToken } = require("../middleware/jwt.js");

// Create a new review
router.post("/:bookId", verifyToken, createReview);

// Get all reviews for a book
router.get("/:bookId", getBookReviews);

// Update a review
router.put("/:reviewId", verifyToken, updateReview);

// Delete a review
router.delete("/:reviewId", verifyToken, deleteReview);

module.exports = router; 