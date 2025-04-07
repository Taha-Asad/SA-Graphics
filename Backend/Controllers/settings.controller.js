const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const Settings = require('../models/settings.model.js');

// Update password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw createError(401, 'Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Delete account
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.json(settings);
  } catch (err) {
    console.error('Error getting settings:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      enableNotifications,
      enableTestimonials,
      enableReviews,
      enableWishlist
    } = req.body;

    let settings = await Settings.findOne();
    
    // If no settings exist, create new settings
    if (!settings) {
      settings = new Settings({});
    }

    // Update fields
    settings.siteName = siteName;
    settings.siteDescription = siteDescription;
    settings.contactEmail = contactEmail;
    settings.contactPhone = contactPhone;
    settings.enableNotifications = enableNotifications;
    settings.enableTestimonials = enableTestimonials;
    settings.enableReviews = enableReviews;
    settings.enableWishlist = enableWishlist;

    // Save settings
    await settings.save();

    res.json({ 
      message: 'Settings updated successfully', 
      settings 
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

module.exports = {
  updatePassword,
  updateProfile,
  deleteAccount,
  getSettings,
  updateSettings
}; 