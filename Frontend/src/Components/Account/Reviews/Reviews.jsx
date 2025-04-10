import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Rating,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as reviewService from '../../../services/reviewService';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    serviceId: '',
    rating: 5,
    comment: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchReviews();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await axios.get('http://localhost:5000/api/v1/services');
      console.log('Services response:', response.data);
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error('Invalid services data:', response.data);
        setSnackbar({
          open: true,
          message: 'Invalid services data received from server',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setSnackbar({
        open: true,
        message: 'Failed to fetch services: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any existing errors
      console.log('Initiating reviews fetch...');
      
      const response = await reviewService.getUserReviews();
      console.log('Reviews fetch successful:', response);
      
      if (Array.isArray(response)) {
        setReviews(response);
        if (response.length === 0) {
          setError('You have not written any reviews yet.');
        }
      } else {
        console.error('Unexpected response format:', response);
        setError('Unable to load reviews. Please try again.');
        setReviews([]);
      }
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      let errorMessage = 'Failed to fetch reviews';
      let severity = 'error';
      
      if (err.message.includes('No authentication token found')) {
        errorMessage = 'Please login to view your reviews';
      } else if (err.message.includes('Server configuration error')) {
        errorMessage = 'Server configuration issue. Our team has been notified.';
        severity = 'warning';
      } else if (err.message.includes('Cannot connect to review service')) {
        errorMessage = 'Unable to connect to review service. Please try again later.';
        severity = 'warning';
      } else if (err.response?.status === 404) {
        errorMessage = 'Review service is currently unavailable';
      }
      
      setError(errorMessage);
      setReviews([]);
      
      // Show error in snackbar
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: severity
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!reviewForm.serviceId || !reviewForm.rating || !reviewForm.comment.trim()) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      const reviewData = {
        serviceId: reviewForm.serviceId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      };

      if (selectedReview) {
        await reviewService.updateServiceReview(selectedReview._id, reviewData);
      } else {
        await reviewService.createServiceReview(reviewData);
      }

      setSnackbar({
        open: true,
        message: selectedReview ? 'Review updated successfully' : 'Review added successfully',
        severity: 'success'
      });
      
      setOpenDialog(false);
      setReviewForm({ serviceId: '', rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to submit review',
        severity: 'error'
      });
    }
  };

  const handleEdit = (review) => {
    if (!review.service?._id) {
      setSnackbar({
        open: true,
        message: 'Cannot edit review: service information is missing',
        severity: 'error'
      });
      return;
    }
    
    setSelectedReview(review);
    setReviewForm({
      serviceId: review.service._id,
      rating: review.rating || 5,
      comment: review.comment || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteServiceReview(reviewId);
      setSnackbar({
        open: true,
        message: 'Review deleted successfully',
        severity: 'success'
      });
      fetchReviews();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete review',
        severity: 'error'
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setReviewForm({
      serviceId: '',
      rating: 5,
      comment: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Format price in Pakistani Rupees
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return 'Price not available';
    }
    return `Rs. ${price.toLocaleString('en-PK')}`;
  };

  // Add a retry button to the error alert
  const renderError = () => {
    if (!error) return null;
    
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => {
              fetchReviews();
              fetchServices();
            }}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
        My Reviews
      </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 3 }}
        >
          Add New Review
        </Button>

        {renderError()}
      
      <Grid container spacing={3}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Grid item xs={12} key={review._id}>
            <Paper sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6">
                        {review.service?.name || review.book?.title || 'Service'}
                      </Typography>
                      {review.service && (
                        <Typography variant="subtitle2" color="text.secondary">
                          {review.service.category || 'No category'} - {review.service.price ? formatPrice(review.service.price) : 'Price not available'}
                        </Typography>
                      )}
                      <Rating value={review.rating} readOnly />
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                    <Box>
                      <IconButton onClick={() => handleEdit(review)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(review._id)}>
                        <DeleteIcon />
                      </IconButton>
                </Box>
              </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                You haven't written any reviews yet.
              </Typography>
          </Grid>
          )}
      </Grid>
    </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedReview ? 'Edit Review' : 'Add New Review'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Service</InputLabel>
              <Select
                value={reviewForm.serviceId}
                onChange={(e) => {
                  console.log('Selected service:', e.target.value);
                  setReviewForm({ ...reviewForm, serviceId: e.target.value });
                }}
                label="Service"
                required
              >
                {services.length === 0 && (
                  <MenuItem disabled value="">
                    No services available
                  </MenuItem>
                )}
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name} ({service.category || 'No category'}) - {service.price ? formatPrice(service.price) : 'Price not available'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(event, newValue) => {
                  setReviewForm({ ...reviewForm, rating: newValue });
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedReview ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reviews; 