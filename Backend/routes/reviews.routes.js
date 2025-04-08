const express = require("express");
const router = express.Router();
const {
  createReview,
  createBookReview,
  getBookReviews,
  updateReview,
  deleteReview,
  getUserReviews
} = require("../Controllers/reviews.controller.js");
const { verifyToken } = require("../middleware/auth");

// Get user's reviews
router.get("/me", verifyToken, getUserReviews);

// Book review routes
router.post("/books/:bookId", verifyToken, createBookReview);
router.get("/books/:bookId", getBookReviews);
router.put("/books/:bookId/reviews/:reviewId", verifyToken, updateReview);
router.delete("/books/:bookId/reviews/:reviewId", verifyToken, deleteReview);

// Service review routes
router.post("/services", verifyToken, createReview);
router.put("/services/:reviewId", verifyToken, updateReview);
router.delete("/services/:reviewId", verifyToken, deleteReview);

module.exports = router; 