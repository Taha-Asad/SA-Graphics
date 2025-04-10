const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema); 