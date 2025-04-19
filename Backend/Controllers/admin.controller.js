const Order = require('../models/order.model');
const User = require('../models/user.model');
const Review = require('../models/reviews.model');
const Course = require('../models/course.model');
const Book = require('../models/book.model');
const createError = require('http-errors');
const { sendEmail } = require('../config/nodemailer');
const ejs = require('ejs');
const path = require('path');
const { sendOrderApprovalEmail } = require('../services/emailService');

// Get all orders with pagination and filtering
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, orderType } = req.query;
    const skip = (page - 1) * limit;

    console.log('Getting all orders with params:', {
      page,
      limit,
      skip,
      orderType
    });

    let query = {};
    if (orderType) {
      query.orderType = orderType;
    }

    console.log('Query for orders:', query);

    // First get the total count
    const total = await Order.countDocuments(query);
    console.log('Total orders found:', total);

    // Then get the orders with careful population
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'items.productId',
        select: 'title price thumbnail',
        model: 'Book'
      })
      .populate({
        path: 'items.courseId',
        select: 'title price thumbnail',
        model: 'Course'
      });

    // Log the first order's structure for debugging
    if (orders.length > 0) {
      console.log('First order structure:', {
        _id: orders[0]._id,
        orderType: orders[0].orderType,
        items: orders[0].items.map(item => ({
          type: item.type,
          product: item.productId ? item.productId._id : null,
          course: item.courseId ? item.courseId._id : null
        }))
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllOrders:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Update order status
    order.status = status || order.status;
    order.paymentStatus = paymentStatus || order.paymentStatus;
    await order.save();

    // If order is approved and payment is confirmed, send approval email
    if (status === 'approved' && paymentStatus === 'confirmed') {
      try {
        await sendOrderApprovalEmail({
          ...order.toObject(),
          orderId: order._id
        });
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    console.log('Attempting to delete order:', orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    await order.deleteOne();
    console.log('Order deleted successfully:', orderId);

    res.json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCourseOrders = await Order.countDocuments({ orderType: 'course' });
    const totalProductOrders = await Order.countDocuments({ orderType: 'product' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      status: 'success',
      data: {
        totalOrders,
        totalCourseOrders,
        totalProductOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(createError(500, 'Error fetching order statistics'));
  }
};

// Get all reviews with pagination and filtering
exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('user', 'name email profilePic')
      .populate('service', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    // Transform reviews to handle missing service
    const transformedReviews = reviews.map(review => ({
      ...review,
      service: review.service || { name: review.productName || 'N/A' }
    }));

    res.json({
      status: 'success',
      data: {
        reviews: transformedReviews,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    next(createError(500, 'Error fetching reviews'));
  }
};

// Update review status
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return next(createError(400, 'Invalid status'));
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    review.status = status;
    await review.save();

    res.json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    next(createError(500, 'Error updating review status'));
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    await review.deleteOne();

    res.json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting review'));
  }
}; 