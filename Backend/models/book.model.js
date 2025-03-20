const mongoose = require("mongoose");
const reviewsSchema = require("./reviews.model.js");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {type:mongoose.Schema.Types.ObjectId , ref : "Reviews" , require:true},
    countInStock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
bookSchema.pre("save", async function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);