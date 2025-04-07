const mongoose = require("mongoose");
const reviewsSchema = require("./reviews.model.js");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  publishDate: { type: Date, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Discount must be between 0 and 100'
    }
  },
  stock: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  averageRating: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reviews"
  }],
  countInStock: {
    type: Number,
    required: true,
  },
});

// Add a virtual property for discounted price
bookSchema.virtual('discountedPrice').get(function() {
  return this.price - (this.price * this.discount / 100);
});

// Ensure virtuals are included when converting to JSON
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

bookSchema.pre("save", async function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const reviews = await mongoose.model("Reviews").find({ _id: { $in: this.reviews } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);