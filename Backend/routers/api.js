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
  resetPasswordSchema,
  updateProfileSchema
} = require("../validations/userValidations");
const { createContact } = require("../Controllers/contact.controller.js");
const { updateProfile } = require('../Controllers/auth.controller');
const orderRoutes = require('./order.routes');
const wishlistController = require('../Controllers/wishlist.controller');
const supportController = require('../Controllers/support.controller');

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

router.post(
  "/auth/logout",
  authMiddleware,
  authController.logout
);

router.post(
  "/auth/change-password",
  authMiddleware,
  authController.changePassword
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
router.use('/orders', orderRoutes);

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

// User routes
router.put('/update-profile', authMiddleware, validateJoi(updateProfileSchema), authController.updateProfile);

// Wishlist routes
router.get('/wishlist', authMiddleware, wishlistController.getWishlist);
router.post('/wishlist', authMiddleware, wishlistController.addToWishlist);
router.delete('/wishlist/:bookId', authMiddleware, wishlistController.removeFromWishlist);
router.delete('/wishlist', authMiddleware, wishlistController.clearWishlist);

// Support routes
router.post('/support', authMiddleware, supportController.createSupportTicket);
router.get('/support/tickets', authMiddleware, supportController.getUserTickets);
router.get('/support/admin/tickets', authMiddleware, adminMiddleware, supportController.getAllTickets);
router.put('/support/admin/tickets/:ticketId', authMiddleware, adminMiddleware, supportController.updateTicketStatus);

// Error handling middleware
router.use(errorHandler);

module.exports = router;