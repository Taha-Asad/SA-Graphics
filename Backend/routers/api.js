const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller.js");
const bookController = require("../controllers/book.controller");
const orderController = require("../controllers/order.controller");
const portfolioController = require("../controllers/portfolio.controller");
const testimonialController = require("../controllers/testimonials.controller");
const reviewsController = require("../Controllers/reviews.controller.js");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { upload } = require("../config/multer");
const errorHandler = require("../middlewares/errorHandler");
const { validateJoi } = require("../middlewares/validationMiddleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../validations/userValidations");
const { createContact } = require("../Controllers/contact.controller.js");

// Auth Routes
router.post(
  "/register",
  upload.single('profilePhoto'),
  validateJoi(registerSchema),
  authController.registerUser
);

router.post(
  "/login",
  validateJoi(loginSchema),
  authController.loginUser
);

router.put(
  "/update-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  authController.updateProfilePic
);

router.post(
  "/forgot-password",
  validateJoi(forgotPasswordSchema),
  authController.forgotPassword
);

// Password Reset Routes
router.get(
  "/reset-password/:token",
  (req, res) => {
    const frontendUrl = `http://localhost:5173/reset-password/${req.params.token}`;
    res.status(302).redirect(frontendUrl);
  }
);

router.post(
  "/reset-password/:token",
  validateJoi(resetPasswordSchema),
  authController.resetPassword
);

// Book Routes
router.post(
  "/books",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.createBook
);

router.get("/books", bookController.getAllBooks);

router.get("/books/:id", bookController.getBookById);

router.put(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.updateBook
);

router.delete(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  bookController.deleteBook
);

// Order Routes
router.post("/orders", authMiddleware, orderController.createOrder);

router.post("/orders/:id/pay", authMiddleware, orderController.processPayment);

router.get("/orders", authMiddleware, orderController.getUserOrders);

router.get("/orders/:id", authMiddleware, orderController.getOrderById);

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

// Portfolio Routes
router.post(
  "/portfolio",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  portfolioController.createProject
);

router.get("/portfolio", portfolioController.getAllProjects);

router.get("/portfolio/:id", portfolioController.getProjectById);

router.put(
  "/portfolio/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  portfolioController.updateProject
);

router.delete(
  "/portfolio/:id",
  authMiddleware,
  adminMiddleware,
  portfolioController.deleteProject
);

// Testimonial Routes
router.post(
  "/testimonials",
  authMiddleware,
  testimonialController.submitTestimonial
);

router.get("/testimonials", testimonialController.getApprovedTestimonials);

router.get(
  "/admin/testimonials",
  authMiddleware,
  adminMiddleware,
  testimonialController.getAllTestimonials
);

router.put(
  "/admin/testimonials/:id",
  authMiddleware,
  adminMiddleware,
  testimonialController.updateTestimonialStatus
);

// Review Routes
router.post("/books/:bookId/reviews", authMiddleware, reviewsController.createReview);
router.get("/books/:bookId/reviews", reviewsController.getBookReviews);
router.put("/books/:bookId/reviews/:reviewId", authMiddleware, reviewsController.updateReview);
router.delete("/books/:bookId/reviews/:reviewId", authMiddleware, reviewsController.deleteReview);

// contact routes
router.post('/contact' , createContact);

// Error handling middleware
router.use(errorHandler);

module.exports = router;