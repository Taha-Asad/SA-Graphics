const Book = require('../models/book.model.js');
const { UPLOADS_FOLDER } = require('../config/multer');
const { bookSchema } = require('../validations/bookValidation.js');
const createError = require('http-errors');

// Create Book
exports.createBook = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Image is required. Please upload an image file.' 
      });
    }

    const { title, author, description, price, countInStock } = req.body;

    // Create book with image filename
    const book = new Book({
      title,
      author,
      description,
      price: Number(price),
      countInStock: Number(countInStock),
      image: req.file.filename,
      averageRating: 0
    });

    // Save the book
    const savedBook = await book.save();

    // Transform the response to include full image URL
    const bookResponse = savedBook.toObject();
    bookResponse.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(201).json({
      message: 'Book created successfully',
      book: bookResponse
    });
  } catch (err) {
    console.error('Book creation error:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    
    // Transform books to include full image URLs
    const booksWithUrls = books.map(book => {
      const bookObj = book.toObject();
      bookObj.image = bookObj.image 
        ? `${req.protocol}://${req.get('host')}/uploads/${bookObj.image}`
        : null;
      return bookObj;
    });

    res.json(booksWithUrls);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get Book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Transform response to include full image URL
    const bookResponse = book.toObject();
    bookResponse.image = bookResponse.image 
      ? `${req.protocol}://${req.get('host')}/uploads/${bookResponse.image}`
      : null;

    res.json(bookResponse);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update Book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, price, countInStock } = req.body;

    const updateData = {
      title,
      author,
      description,
      price: Number(price),
      countInStock: Number(countInStock)
    };

    // Only update image if new file is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Transform response to include full image URL
    const bookResponse = book.toObject();
    bookResponse.image = bookResponse.image 
      ? `${req.protocol}://${req.get('host')}/uploads/${bookResponse.image}`
      : null;

    res.json({ 
      message: 'Book updated successfully', 
      book: bookResponse 
    });
  } catch (err) {
    console.error('Book update error:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = exports;