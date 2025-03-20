const Book = require('../models/book.model.js');
const upload = require('../config/multer.js');
const { bookSchema, reviewSchema } = require('../validations/bookValidation.js');

// Create Book with Image Upload
exports.createBook = [
  upload.single('image'),
  async (req, res) => {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, author, price, description } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      const book = new Book({ title, author, price, description, image });
      await book.save();
      res.status(201).json({ message: 'Book created successfully', book });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },
];

// Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get Book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews.userId', 'name');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update Book with Image Upload
exports.updateBook = [
  upload.single('image'),
  async (req, res) => {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, author, price, description } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { title, author, price, description, image },
        { new: true }
      );
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json({ message: 'Book updated successfully', book });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },
];

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

// Add Review to Book
exports.addReview = async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { rating, comment } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = {
      userId: req.user.id,
      rating,
      comment,
    };

    book.reviews.push(review);
    await book.save();

    res.json({ message: 'Review added successfully', book });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};