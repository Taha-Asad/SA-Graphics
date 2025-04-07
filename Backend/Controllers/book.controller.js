const Book = require('../models/book.model.js');
const { UPLOADS_FOLDER, UPLOAD_PATH } = require('../config/multer');
const { bookSchema } = require('../validations/bookValidation.js');
const createError = require('http-errors');
const path = require('path');
const fs = require('fs');

// Create Book
exports.createBook = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request headers:', req.headers);
    console.log('Request user:', req.user);

    // Handle the uploaded file
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: "Cover image is required" });
    }

    // Verify the file exists on disk
    if (!fs.existsSync(req.file.path)) {
      console.error('File not found on disk:', req.file.path);
      return res.status(500).json({ message: "File upload failed" });
    }

    // Create book data with file path
    const bookData = {
      ...req.body,
      coverImage: `/uploads/${req.file.filename}`, // Save the file path
      price: Number(req.body.price || 0),
      stock: Number(req.body.stock || 0),
      countInStock: Number(req.body.countInStock || 0),
      discount: Number(req.body.discount || 0),
      publishDate: new Date(req.body.publishDate)
    };

    console.log('Processed book data:', bookData);

    // Validate the book data
    const { error } = bookSchema.validate(bookData);
    if (error) {
      console.log('Validation error:', error.details);
      // Delete the uploaded file if validation fails
      try {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file due to validation error:', req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after validation error:', unlinkError);
      }
      return res.status(400).json({ message: error.details[0].message });
    }

    console.log('Creating new book with data:', bookData);
    const book = new Book(bookData);
    console.log('Book object created:', book);
    
    console.log('Saving book to database...');
    await book.save();
    console.log('Book saved successfully');
    
    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    console.error('Book creation error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      errors: error.errors
    });
    
    // If there was an error and a file was uploaded, delete it
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('Deleted uploaded file due to error:', req.file.path);
        }
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "ISBN must be unique" });
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Log the full error for debugging
    console.error('Full error object:', error);
    
    // Return a generic error message
    res.status(500).json({ 
      message: "An error occurred while creating the book",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Book by ID
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } 
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Book
exports.updateBook = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);
    
    const bookId = req.params.id;
    const updateData = { ...req.body };
    
    // If a new file was uploaded, update the coverImage
    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.countInStock) updateData.countInStock = Number(updateData.countInStock);
    if (updateData.discount) updateData.discount = Number(updateData.discount);
    if (updateData.publishDate) updateData.publishDate = new Date(updateData.publishDate);

    // Validate the update data
    const { error } = bookSchema.validate({
      ...updateData,
      // Include required fields from existing book if not in update
      ...(req.file ? {} : { coverImage: 'placeholder' }) // Add placeholder if no new image
    });
    
    if (error) {
      // If there was a file uploaded but validation failed, delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('Deleted uploaded file due to validation error:', req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file after validation error:', unlinkError);
        }
      }
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      // If there was a file uploaded but book not found, delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('Deleted uploaded file because book not found:', req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error('Book update error:', error);
    
    // If there was an error and a file was uploaded, delete it
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('Deleted uploaded file due to error:', req.file.path);
        }
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "ISBN must be unique" });
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = exports;