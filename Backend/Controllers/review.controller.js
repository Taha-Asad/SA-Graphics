const { sendReviewNotification } = require('../services/adminNotificationService');

const createReview = async (req, res) => {
  try {
    const { error } = validateReview(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { content, rating, productId, courseId } = req.body;
    const userId = req.user._id;

    // Check if user has already reviewed this product/course
    const existingReview = await Review.findOne({
      userId,
      $or: [
        { productId },
        { courseId }
      ]
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this item'
      });
    }

    // Create new review
    const review = new Review({
      userId,
      content,
      rating,
      productId,
      courseId
    });

    await review.save();

    // Populate user details for notification
    await review.populate('userId', 'name email');

    // Send admin notification
    await sendReviewNotification(review);

    res.status(201).json({
      status: 'success',
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create review'
    });
  }
}; 