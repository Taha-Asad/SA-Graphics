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
const {authenticateUser} = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/admin.js");
const { bookUpload, paymentProofUpload, projectUpload, profileUpload, handleMulterError } = require("../config/multer");
const errorHandler = require("../middleware/errorHandler.js");
const { validateJoi } = require("../middleware/validationMiddleware.js");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
} = require("../validations/userValidations");
const { createContact } = require("../Controllers/contact.controller.js");
const { updateProfile } = require('../Controllers/auth.controller');
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
  authenticateUser,
  authController.logout
);

router.post(
  "/auth/change-password",
  authenticateUser,
  authController.changePassword
);

router.put(
  "/update-profile-pic",
  authenticateUser,
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
  authenticateUser,
  adminMiddleware,
  bookUpload.single("coverImage"),
  handleMulterError,
  bookController.createBook
);

router.get("/books", bookController.getAllBooks);

router.get("/books/:id", bookController.getBook);

router.put(
  "/books/:id",
  authenticateUser,
  adminMiddleware,
  bookUpload.single("coverImage"),
  handleMulterError,
  bookController.updateBook
);

router.delete(
  "/books/:id",
  authenticateUser,
  adminMiddleware,
  bookController.deleteBook
);

// Order Routes
router.post('/orders', authenticateUser, paymentProofUpload.single('transferProof'), orderController.createOrder);
router.get('/orders', authenticateUser, orderController.getUserOrders);
router.get('/orders/:orderId', authenticateUser, orderController.getOrderById);
router.patch('/orders/:orderId/status', authenticateUser, adminMiddleware, orderController.updateOrderStatus);
router.patch('/orders/:orderId/payment-status', authenticateUser, adminMiddleware, orderController.verifyPayment);
router.post('/orders/:orderId/cancel', authenticateUser, orderController.cancelOrder);

// Portfolio Routes
router.post(
  "/portfolio",
  authenticateUser,
  adminMiddleware,
  projectUpload.single("image"),
  portfolioController.createProject
);

router.get("/portfolio", portfolioController.getAllProjects);

router.get("/portfolio/:id", portfolioController.getProjectById);

router.put(
  "/portfolio/:id",
  authenticateUser,
  adminMiddleware,
  projectUpload.single("image"),
  portfolioController.updateProject
);

router.delete(
  "/portfolio/:id",
  authenticateUser,
  adminMiddleware,
  portfolioController.deleteProject
);

// Testimonial Routes
router.post(
  "/testimonials",
  authenticateUser,
  testimonialController.submitTestimonial
);

router.get("/testimonials", testimonialController.getApprovedTestimonials);

router.get(
  "/admin/testimonials",
  authenticateUser,
  adminMiddleware,
  testimonialController.getAllTestimonials
);

router.put(
  "/admin/testimonials/:id",
  authenticateUser,
  adminMiddleware,
  testimonialController.updateTestimonialStatus
);

router.delete(
  "/admin/testimonials/:id",
  authenticateUser,
  adminMiddleware,
  testimonialController.deleteTestimonial
);

// Review Routes
router.post("/books/:bookId/reviews", authenticateUser, reviewsController.createBookReview);
router.get("/books/:bookId/reviews", reviewsController.getBookReviews);
router.put("/books/:bookId/reviews/:reviewId", authenticateUser, reviewsController.updateReview);
router.delete("/books/:bookId/reviews/:reviewId", authenticateUser, reviewsController.deleteReview);

// Service Review Routes
router.post("/reviews/services", authenticateUser, reviewsController.createReview);
router.put("/reviews/services/:reviewId", authenticateUser, reviewsController.updateReview);
router.delete("/reviews/services/:reviewId", authenticateUser, reviewsController.deleteReview);

// contact routes
router.post('/contact' , createContact);

// User routes
router.get('/users/me', authenticateUser, (req, res) => {
  res.json(req.user);
});
router.get('/users/stats', authenticateUser, userController.getUserStats);
router.put('/update-profile', authenticateUser, validateJoi(updateProfileSchema), authController.updateProfile);


// Support routes
router.post('/support', authenticateUser, supportController.createSupportTicket);
router.get('/support/tickets', authenticateUser, supportController.getUserTickets);
router.get('/support/admin/tickets', authenticateUser, adminMiddleware, supportController.getAllTickets);
router.put('/support/admin/tickets/:ticketId', authenticateUser, adminMiddleware, supportController.updateTicketStatus);

// Admin User Management Routes
router.get(
  "/admin/users",
  authenticateUser,
  adminMiddleware,
  userController.getAllUsers
);

router.put(
  "/admin/users/:userId",
  authenticateUser,
  adminMiddleware,
  userController.updateUser
);

router.delete(
  "/admin/users/:userId",
  authenticateUser,
  adminMiddleware,
  userController.deleteUser
);

router.patch(
  "/admin/users/:userId/block",
  authenticateUser,
  adminMiddleware,
  userController.blockUser
);

router.patch(
  "/admin/users/:userId/unblock",
  authenticateUser,
  adminMiddleware,
  userController.unblockUser
);

// Book Routes
router.post("/admin/books", authenticateUser, adminMiddleware, bookController.createBook);
router.get("/admin/books", authenticateUser, adminMiddleware, bookController.getAllBooks);
router.get("/admin/books/:id", authenticateUser, adminMiddleware, bookController.getBook);
router.put("/admin/books/:id", authenticateUser, adminMiddleware, bookController.updateBook);
router.delete("/admin/books/:id", authenticateUser, adminMiddleware, bookController.deleteBook);

// Project Routes
router.post("/admin/projects", authenticateUser, adminMiddleware, projectController.createProject);
router.get("/admin/projects", authenticateUser, adminMiddleware, projectController.getAllProjects);
router.get("/admin/projects/:id", authenticateUser, adminMiddleware, projectController.getProject);
router.put("/admin/projects/:id", authenticateUser, adminMiddleware, projectController.updateProject);
router.delete("/admin/projects/:id", authenticateUser, adminMiddleware, projectController.deleteProject);

// Admin Routes
router.get(
  "/admin/dashboard",
  authenticateUser,
  adminMiddleware,
  dashboardController.getDashboardStats
);

// Settings Routes
router.get(
  "/settings",
  authenticateUser,
  adminMiddleware,
  settingsController.getSettings
);

router.put(
  "/settings",
  authenticateUser,
  adminMiddleware,
  settingsController.updateSettings
);

// Service Routes
router.get("/services", serviceController.getServices);
router.post("/services", authenticateUser, adminMiddleware, serviceController.createService);
router.put("/services/:id", authenticateUser, adminMiddleware, serviceController.updateService);
router.delete("/services/:id", authenticateUser, adminMiddleware, serviceController.deleteService);

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