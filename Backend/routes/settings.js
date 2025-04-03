const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

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

// Update settings (protected route)
router.put('/', auth, async (req, res) => {
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

module.exports = router; 