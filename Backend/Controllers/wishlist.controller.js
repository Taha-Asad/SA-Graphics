const createError = require('http-errors');
const Wishlist = require('../models/wishlist.model');
const Book = require('../models/book.model');

// Get user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'items.book',
        select: 'title author price image averageRating reviewCount countInStock'
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(createError(500, 'Error fetching wishlist'));
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return next(createError(400, 'Book ID is required'));
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return next(createError(404, 'Book not found'));
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [{ book: bookId }]
      });
    } else {
      // Check if book is already in wishlist
      const existingItem = wishlist.items.find(
        item => item.book.toString() === bookId
      );

      if (existingItem) {
        return next(createError(400, 'Book already in wishlist'));
      }

      wishlist.items.push({ book: bookId });
      await wishlist.save();
    }

    // Populate book details before sending response
    await wishlist.populate({
      path: 'items.book',
      select: 'title author price image averageRating reviewCount countInStock'
    });

    res.json({
      success: true,
      message: 'Book added to wishlist',
      data: wishlist
    });
  } catch (error) {
    next(createError(500, 'Error adding to wishlist'));
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    const itemIndex = wishlist.items.findIndex(
      item => item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return next(createError(404, 'Book not found in wishlist'));
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.json({
      success: true,
      message: 'Book removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    next(createError(500, 'Error removing from wishlist'));
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error) {
    next(createError(500, 'Error clearing wishlist'));
  }
}; 