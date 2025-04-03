const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
  },
  siteDescription: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  enableRegistration: {
    type: Boolean,
    default: true,
  },
  enableTestimonials: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maxTestimonialsPerPage: {
    type: Number,
    default: 6,
    min: 1,
  },
  defaultRating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema); 