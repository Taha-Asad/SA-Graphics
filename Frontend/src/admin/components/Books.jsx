import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    isbn: '',
    category: '',
    stock: '',
    publishDate: '',
    countInStock: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/books');
      const booksData = Array.isArray(response.data) ? response.data : 
                       response.data.books ? response.data.books : [];
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        isbn: book.isbn || '',
        category: book.category || '',
        stock: book.stock || '',
        publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split('T')[0] : '',
        countInStock: book.countInStock || '',
        image: null,
      });
    } else {
      setSelectedBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        isbn: '',
        category: '',
        stock: '',
        publishDate: '',
        countInStock: '',
        image: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      price: '',
      isbn: '',
      category: '',
      stock: '',
      publishDate: '',
      countInStock: '',
      image: null,
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // First append the image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Convert numeric fields
      const numericFields = {
        price: formData.price,
        stock: formData.stock,
        countInStock: formData.countInStock
      };

      // Append all other fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          let value = formData[key];
          
          // Convert numeric fields
          if (key in numericFields) {
            value = Number(value);
          }
          
          // Convert date field
          if (key === 'publishDate') {
            value = new Date(value).toISOString();
          }
          
          formDataToSend.append(key, value);
        }
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (selectedBook) {
        await axiosInstance.put(`/books/${selectedBook._id}`, formDataToSend, config);
        setSuccess('Book updated successfully');
      } else {
        await axiosInstance.post('/books', formDataToSend, config);
        setSuccess('Book created successfully');
      }
      
      fetchBooks();
      handleClose();
    } catch (error) {
      console.error('Error saving book:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save book';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axiosInstance.delete(`/books/${id}`);
        setSuccess('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        setError('Failed to delete book');
      }
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Books Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Book
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(books) && books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && Array.isArray(books) && books.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />
              <TextField
                name="isbn"
                label="ISBN"
                value={formData.isbn}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="stock"
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="countInStock"
                label="Count in Stock"
                type="number"
                value={formData.countInStock}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="publishDate"
                label="Publish Date"
                type="date"
                value={formData.publishDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <input
                accept="image/*"
                type="file"
                name="image"
                onChange={handleChange}
                style={{ marginTop: '1rem' }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedBook ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Books; 