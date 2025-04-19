const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getAllContact, deleteContact } = require('../Controllers/contact.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/course.model');
const { saveUploadedFile, resolveImageUrl } = require('../utils/imageUtils');
const Order = require('../models/order.model');
const { sendEmail } = require('../config/nodemailer');
const ejs = require('ejs');

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(isAdmin);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Order management routes
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);
router.delete('/orders/:orderId', adminController.deleteOrder);
router.get('/orders/stats', adminController.getOrderStats);

// Send email for course purchase
router.post('/send-email', verifyToken, isAdmin, async (req, res) => {
  try {
    const { orderId, type } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (type === 'course-purchase') {
      const courseItem = order.items.find(item => item.type === 'course');
      const emailTemplate = await ejs.renderFile(
        path.join(__dirname, '../views/emails/coursePurchase.ejs'),
        {
          userName: order.shippingAddress.name,
          courseName: courseItem.title,
          orderId: order._id,
          amount: order.totalAmount
        }
      );

      await sendEmail({
        to: order.shippingAddress.email,
        subject: 'Course Purchase Confirmation - SA Graphics',
        html: emailTemplate
      });

      res.json({ message: 'Email sent successfully' });
    } else {
      res.status(400).json({ message: 'Invalid email type' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: error.message });
  }
});

// Review management routes
router.get('/reviews', adminController.getAllReviews);
router.patch('/reviews/:reviewId/status', adminController.updateReviewStatus);
router.delete('/reviews/:reviewId', adminController.deleteReview);

// Contact management routes
router.get('/contacts', getAllContact);
router.delete('/contacts/:id', deleteContact);

// Get all courses (admin view)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course
router.post('/courses', upload.single('thumbnail'), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      price: parseFloat(req.body.price),
      whatYouWillLearn: JSON.parse(req.body.whatYouWillLearn),
      requirements: JSON.parse(req.body.requirements),
      isPublished: req.body.isPublished === 'true'
    };

    if (req.file) {
      courseData.thumbnail = saveUploadedFile(req.file, 'courses');
    }

    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a course
router.put('/courses/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      price: parseFloat(req.body.price),
      whatYouWillLearn: JSON.parse(req.body.whatYouWillLearn),
      requirements: JSON.parse(req.body.requirements)
    };

    if (req.file) {
      // Delete old thumbnail if it exists
      const oldCourse = await Course.findById(req.params.id);
      if (oldCourse?.thumbnail) {
        const oldPath = path.join(__dirname, '..', oldCourse.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      courseData.thumbnail = saveUploadedFile(req.file, 'courses');
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      courseData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete thumbnail if it exists
    if (course.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', 'public', course.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle course publish status
router.patch('/courses/:id/toggle-publish', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isPublished = !course.isPublished;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Admin route error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = router; 