const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { auth } = require('../middleware/auth');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const upload = require('../middleware/upload');

// Protected routes - apply auth middleware to all routes
router.use(auth);

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        siteName: 'SA Graphics',
        siteDescription: 'Professional Graphics Design Services',
        contactEmail: 'contact@sagraphics.com',
        contactPhone: '+1234567890',
        enableRegistration: true,
        enableTestimonials: true,
        maintenanceMode: false,
        maxTestimonialsPerPage: 6,
        defaultRating: 5,
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Update existing settings
      Object.keys(req.body).forEach(key => {
        settings[key] = req.body[key];
      });
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
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
});

// Update profile with file upload
router.put('/profile', upload.single('profilePic'), async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User ID:', req.user.id);

    const updates = req.body;
    
    // Handle file upload if present
    if (req.file) {
      // Use absolute URL for the profile picture
      updates.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
      console.log('Profile pic path:', updates.profilePic);
    }

    if (!req.user || !req.user.id) {
      console.error('No user ID found in request');
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log('Updated user:', user);
    res.json(user);

  } catch (error) {
    console.error('Detailed error in profile update:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    next(error);
  }
});

// Delete account
router.delete('/account', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 