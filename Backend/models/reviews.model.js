const mongoose = require("mongoose");

const reviewsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    productName: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reviews", reviewsSchema);
