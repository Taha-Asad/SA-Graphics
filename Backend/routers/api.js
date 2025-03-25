const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller.js");
const bookController = require("../Controllers/book.controller.js");
const orderController = require("../Controllers/order.controller.js");
const projectController = require("../Controllers/portfolio.controller.js");
const testimonialController = require("../Controllers/testimonials.controller.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const adminMiddleware = require("../middlewares/adminMiddleware.js");
const upload = require("../config/multer");

// Auth Routes
router.post(
  "/register",
  upload.single("profilePic"),
  authController.registerUser
); // Register a new user
router.post("/login", authController.loginUser); // Login a user
router.put(
  "/update-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  authController.updateProfilePic
);
router.post("/forgot-password", authController.forgotPassword); // Forgot password
router.post("/reset-password/:token", authController.resetPassword); // Reset password

// Book Routes
router.post(
  "/books",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.createBook
); // Create a book (Admin Only)
router.get("/books", bookController.getAllBooks); // Get all books (Public)
router.get("/books/:id", bookController.getBookById); // Get a single book by ID (Public)
router.put(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.updateBook
); // Update a book (Admin Only)
router.delete(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  bookController.deleteBook
); // Delete a book (Admin Only)
router.post("/books/:id/reviews", authMiddleware, bookController.addReview); // Add a review to a book (Logged-in Users)

// Order Routes
router.post("/orders", authMiddleware, orderController.createOrder); // Create an order (Logged-in Users)
router.post("/payments", authMiddleware, orderController.processPayment); // Process payment (Logged-in Users)
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
); // Update order status (Admin Only)

// Project Routes
router.post(
  "/projects",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  projectController.createProject
); // Create a project (Admin Only)
router.get("/projects", projectController.getAllProjects); // Get all projects (Public)
router.get("/projects/:id", projectController.getProjectById); // Get a single project by ID (Public)
router.put(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  projectController.updateProject
); // Update a project (Admin Only)
router.delete(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  projectController.deleteProject
); // Delete a project (Admin Only)

// Testimonial Routes
router.post(
  "/testimonials",
  authMiddleware,
  testimonialController.submitTestimonial
); // Submit a testimonial (Logged-in Users)
router.get(
  "/admin/testimonials",
  authMiddleware,
  adminMiddleware,
  testimonialController.getTestimonials
); // Get all testimonials (Admin Only)
router.put(
  "/admin/testimonials/:id",
  authMiddleware,
  adminMiddleware,
  testimonialController.updateTestimonialStatus
); // Approve/Reject a testimonial (Admin Only)

module.exports = router;
