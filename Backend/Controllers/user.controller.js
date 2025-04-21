const Order = require('../models/order.model');
const Review = require('../models/reviews.model');
const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');
const { sendUserRegistrationNotification } = require('../services/adminNotificationService');
const bcrypt = require('bcrypt');

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log('Fetching stats for user:', userId);

    // Get counts in parallel with correct field names
    const [orderCount, reviews, wishlistCount] = await Promise.all([
      Order.countDocuments({ userId: userId }), // Order model uses userId
      Review.find({ user: userId }), // Only count reviews from the Reviews model
      Wishlist.findOne({ user: userId }).then(wishlist => wishlist ? wishlist.items.length : 0)
    ]);

    // Log the actual reviews for debugging
    console.log('Reviews count:', reviews.length);

    console.log('Stats found:', {
      orders: orderCount,
      reviews: reviews.length,
      wishlist: wishlistCount
    });

    res.status(200).json({
      orders: orderCount || 0,
      reviews: reviews.length || 0,
      wishlist: wishlistCount || 0
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    next(error);
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'blocked' } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Error blocking user' });
  }
};

// Unblock user
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'active' } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Error unblocking user' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { name, email, password, phoneNo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNo
    });

    await user.save();

    // Send admin notification
    await sendUserRegistrationNotification(user);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo
        }
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to register user'
    });
  }
};

module.exports = {
  getUserStats,
  getAllUsers,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  registerUser
}; 