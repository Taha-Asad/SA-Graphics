const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller.js");
const bookController = require("../controllers/book.controller");
const orderController = require("../controllers/order.controller");
const projectController = require("../controllers/portfolio.controller");
const testimonialController = require("../controllers/testimonials.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../config/multer");
const errorHandler = require("../middlewares/errorHandler");
const { validateJoi } = require("../middlewares/validationMiddleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../validations/userValidations");

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

router.post(
  "/books/:id/reviews",
  authMiddleware,
  bookController.addReview
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

// Project Routes
router.post(
  "/projects",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  projectController.createProject
);

router.get("/projects", projectController.getAllProjects);

router.get("/projects/:id", projectController.getProjectById);

router.put(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  projectController.updateProject
);

router.delete(
  "/projects/:id",
  authMiddleware,
  adminMiddleware,
  projectController.deleteProject
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

// Error handling middleware
router.use(errorHandler);

module.exports = router;