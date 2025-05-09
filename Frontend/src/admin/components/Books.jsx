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
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Books = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    countInStock: '',
    publishDate: '',
    discount: '0',
    bulkDiscount: '0'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchBooks();
  }, [user, navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/books');
      const booksData = Array.isArray(response.data) ? response.data : response.data.books ? response.data.books : [];
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
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        category: book.category || '',
        price: book.price || '',
        stock: book.stock || '',
        countInStock: book.countInStock || '',
        publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split('T')[0] : '',
        discount: book.discount || '0',
        bulkDiscount: book.bulkDiscount || '0'
      });
    } else {
      setSelectedBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        countInStock: '',
        publishDate: '',
        discount: '0',
        bulkDiscount: '0'
      });
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      countInStock: '',
      publishDate: '',
      discount: '0',
      bulkDiscount: '0'
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'coverImage') {
      setFormData({ ...formData, coverImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requiredFields = ['title', 'author', 'description', 'category', 'publishDate'];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    if (!user || user.role !== 'admin') {
      setError('You must be logged in as an admin to perform this action');
      navigate('/login');
      return;
    }

    try {
      if (!selectedBook && !formData.coverImage) {
        setError('Cover image is required for new books');
        return;
      }

      const formDataToSend = new FormData();

      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      const numericFields = {
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        countInStock: parseInt(formData.countInStock) || 0,
        discount: parseFloat(formData.discount) || 0,
        bulkDiscount: parseFloat(formData.bulkDiscount) || 0
      };

      Object.keys(formData).forEach(key => {
        if (key !== 'coverImage') {
          let value = formData[key];

          if (key in numericFields) {
            value = numericFields[key];
          }

          if (key === 'publishDate') {
            value = new Date(value).toISOString();
          }

          formDataToSend.append(key, value);
        }
      });

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
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
      let errorMessage = 'Failed to save book';

      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        if (error.response.data?.errors) {
          const validationErrors = Object.values(error.response.data.errors).join(', ');
          errorMessage = `Validation errors: ${validationErrors}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);

      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axiosInstance.delete(`/books/${id}`);
        setSuccess('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
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
              <TableCell>Bulk Discount (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(books) && books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>Rs. {book.price}</TableCell>
                <TableCell>{book.bulkDiscount || 0}%</TableCell>
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
                <TableCell colSpan={5} align="center">
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required />
              <TextField name="author" label="Author" value={formData.author} onChange={handleChange} fullWidth required />
              <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} required />
              <TextField name="category" label="Category" value={formData.category} onChange={handleChange} fullWidth required />
              <TextField name="price" label="Price (Rs.)" type="number" value={formData.price} onChange={handleChange} fullWidth required helperText="Enter price in Rupees" />
              <TextField name="discount" label="Discount (%)" type="number" value={formData.discount} onChange={handleChange} fullWidth InputProps={{ inputProps: { min: 0, max: 100 }}} />
              <TextField name="bulkDiscount" label="Bulk Discount (6+ items) (%)" type="number" value={formData.bulkDiscount} onChange={handleChange} fullWidth InputProps={{ inputProps: { min: 0, max: 100 }}} helperText="Discount when a user buys 6 or more copies" />
              <TextField name="stock" label="Stock" type="number" value={formData.stock} onChange={handleChange} fullWidth required />
              <TextField name="countInStock" label="Count in Stock" type="number" value={formData.countInStock} onChange={handleChange} fullWidth required />
              <TextField name="publishDate" label="Publish Date" type="date" value={formData.publishDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
              <input accept="image/*" id="coverImage" name="coverImage" type="file" onChange={handleChange} style={{ display: 'none' }} />
              <label htmlFor="coverImage">
                <Button variant="outlined" component="span" fullWidth>
                  {selectedBook ? 'Change Cover Image' : 'Upload Cover Image'}
                </Button>
              </label>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (selectedBook ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Books;
