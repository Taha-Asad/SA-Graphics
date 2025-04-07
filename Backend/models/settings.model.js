const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: 'SA Graphics'
    },
    siteDescription: {
      type: String,
      required: true,
      default: 'Professional Graphics Design Services'
    },
    contactEmail: {
      type: String,
      required: true,
      default: 'contact@sagraphics.com'
    },
    contactPhone: {
      type: String,
      required: true,
      default: '+1234567890'
    },
    enableNotifications: {
      type: Boolean,
      default: true
    },
    enableTestimonials: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    },
    enableWishlist: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema); 