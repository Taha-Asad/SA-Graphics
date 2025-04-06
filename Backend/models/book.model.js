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