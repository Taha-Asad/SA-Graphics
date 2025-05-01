const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller.js");
const bookController = require("../controllers/book.controller");
const orderController = require("../controllers/order.controller");
const portfolioController = require("../controllers/portfolio.controller");
const testimonialController = require("../Controllers/testimonials.controller.js");
const reviewsController = require("../Controllers/reviews.controller.js");
const userController = require("../Controllers/user.controller.js");
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { bookUpload, paymentProofUpload, projectUpload, profileUpload, handleMulterError } = require("../config/multer");
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
const wishlistController = require('../Controllers/wishlist.controller');
const supportController = require('../Controllers/support.controller');
const dashboardController = require('../Controllers/dashboard.controller');
const settingsController = require('../Controllers/settings.controller');
const serviceController = require('../Controllers/service.controller');
const { verifyToken } = require('../middleware/auth');

// Auth Routes
router.post(
  "/register",
  profileUpload.single('profilePhoto'),
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
  profileUpload.single("profilePic"),
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
  bookUpload.single("coverImage"),
  handleMulterError,
  bookController.createBook
);

router.get("/books", bookController.getAllBooks);

router.get("/books/:id", bookController.getBook);

router.put(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  bookUpload.single("coverImage"),
  handleMulterError,
  bookController.updateBook
);

router.delete(
  "/books/:id",
  authMiddleware,
  adminMiddleware,
  bookController.deleteBook
);

// Order Routes
router.post('/orders', authMiddleware, paymentProofUpload.single('transferProof'), orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:orderId', authMiddleware, orderController.getOrderById);
router.patch('/orders/:orderId/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.patch('/orders/:orderId/payment-status', authMiddleware, adminMiddleware, orderController.verifyPayment);
router.post('/orders/:orderId/cancel', authMiddleware, orderController.cancelOrder);

// Portfolio Routes
router.post(
  "/portfolio",
  authMiddleware,
  adminMiddleware,
  projectUpload.single("image"),
  portfolioController.createProject
);

router.get("/portfolio", portfolioController.getAllProjects);

router.get("/portfolio/:id", portfolioController.getProjectById);

router.put(
  "/portfolio/:id",
  authMiddleware,
  adminMiddleware,
  projectUpload.single("image"),
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

router.delete(
  "/admin/testimonials/:id",
  authMiddleware,
  adminMiddleware,
  testimonialController.deleteTestimonial
);

// Review Routes
router.post("/books/:bookId/reviews", authMiddleware, reviewsController.createBookReview);
router.get("/books/:bookId/reviews", reviewsController.getBookReviews);
router.put("/books/:bookId/reviews/:reviewId", authMiddleware, reviewsController.updateReview);
router.delete("/books/:bookId/reviews/:reviewId", authMiddleware, reviewsController.deleteReview);

// Service Review Routes
router.post("/reviews/services", authMiddleware, reviewsController.createReview);
router.put("/reviews/services/:reviewId", authMiddleware, reviewsController.updateReview);
router.delete("/reviews/services/:reviewId", authMiddleware, reviewsController.deleteReview);

// contact routes
router.post('/contact' , createContact);

// User routes
router.get('/users/me', authMiddleware, (req, res) => {
  res.json(req.user);
});
router.get('/users/stats', authMiddleware, userController.getUserStats);
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

// Admin User Management Routes
router.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers
);

router.put(
  "/admin/users/:userId",
  authMiddleware,
  adminMiddleware,
  userController.updateUser
);

router.delete(
  "/admin/users/:userId",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

router.patch(
  "/admin/users/:userId/block",
  authMiddleware,
  adminMiddleware,
  userController.blockUser
);

router.patch(
  "/admin/users/:userId/unblock",
  authMiddleware,
  adminMiddleware,
  userController.unblockUser
);

// Book Routes
router.post("/admin/books", authMiddleware, adminMiddleware, bookController.createBook);
router.get("/admin/books", authMiddleware, adminMiddleware, bookController.getAllBooks);
router.get("/admin/books/:id", authMiddleware, adminMiddleware, bookController.getBook);
router.put("/admin/books/:id", authMiddleware, adminMiddleware, bookController.updateBook);
router.delete("/admin/books/:id", authMiddleware, adminMiddleware, bookController.deleteBook);

// Project Routes
router.post("/admin/projects", authMiddleware, adminMiddleware, projectController.createProject);
router.get("/admin/projects", authMiddleware, adminMiddleware, projectController.getAllProjects);
router.get("/admin/projects/:id", authMiddleware, adminMiddleware, projectController.getProject);
router.put("/admin/projects/:id", authMiddleware, adminMiddleware, projectController.updateProject);
router.delete("/admin/projects/:id", authMiddleware, adminMiddleware, projectController.deleteProject);

// Admin Routes
router.get(
  "/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  dashboardController.getDashboardStats
);

// Settings Routes
router.get(
  "/settings",
  authMiddleware,
  adminMiddleware,
  settingsController.getSettings
);

router.put(
  "/settings",
  authMiddleware,
  adminMiddleware,
  settingsController.updateSettings
);

// Service Routes
router.get("/services", serviceController.getServices);
router.post("/services", authMiddleware, adminMiddleware, serviceController.createService);
router.put("/services/:id", authMiddleware, adminMiddleware, serviceController.updateService);
router.delete("/services/:id", authMiddleware, adminMiddleware, serviceController.deleteService);

// Update profile with photo upload
router.patch('/profile',
  verifyToken,
  profileUpload.single('profilePhoto'),
  handleMulterError,
  async (req, res) => {
    // ... rest of the profile update logic
  }
);

// Error handling middleware
router.use(errorHandler);

module.exports = router;