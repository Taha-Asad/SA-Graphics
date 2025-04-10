const Order = require('../models/Order.model');
const User = require('../models/user.model');
const Review = require('../models/reviews.model');
const createError = require('http-errors');

// Get all orders with pagination and filtering
exports.getAllOrders = async (req, res, next) => {
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

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('userId', 'name email profilePic')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        orders,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(createError(500, 'Error fetching orders'));
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    console.log('Updating order status:', { orderId: req.params.orderId, status: req.body.status });
    
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      console.log('Invalid status provided:', status);
      return next(createError(400, 'Invalid status'));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return next(createError(404, 'Order not found'));
    }

    const oldStatus = order.status;
    order.status = status;
    if (!order.trackingUpdates) {
      order.trackingUpdates = [];
    }
    order.trackingUpdates.push({
      status,
      message: `Order status updated from ${oldStatus} to ${status} by admin`,
      timestamp: new Date()
    });

    await order.save();
    console.log('Order status updated successfully:', { orderId, oldStatus, newStatus: status });

    res.json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    next(createError(500, `Error updating order status: ${error.message}`));
  }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    await order.deleteOne();

    res.json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting order'));
  }
};

// Get order statistics
exports.getOrderStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' })
    ]);

    res.json({
      status: 'success',
      data: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
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