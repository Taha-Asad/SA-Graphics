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
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as reviewService from '../../../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    productName: '',
    rating: 5,
    comment: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getUserReviews();
      setReviews(data.reviews || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (review = null) => {
    if (review) {
      setSelectedReview(review);
      setReviewForm({
        productName: review.productName,
        rating: review.rating,
        comment: review.comment
      });
    } else {
      setSelectedReview(null);
      setReviewForm({
        productName: '',
        rating: 5,
        comment: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setReviewForm({
      productName: '',
      rating: 5,
      comment: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setReviewForm(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReview) {
        await reviewService.updateReview(selectedReview.id, reviewForm);
        setSnackbar({
          open: true,
          message: 'Review updated successfully',
          severity: 'success'
        });
      } else {
        await reviewService.addReview(reviewForm);
        setSnackbar({
          open: true,
          message: 'Review added successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchReviews();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save review',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
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
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , mb: 8 }}>
          <Typography variant="h5" sx={{ color: '#333', fontWeight: 500  }}>
            My Reviews
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#149DDD',
              '&:hover': {
                bgcolor: '#1180B7'
              }
            }}
          >
            ADD REVIEW
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {reviews.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't written any reviews yet.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              color="primary"
              sx={{
                borderColor: '#149DDD',
                color: '#149DDD',
                '&:hover': {
                  borderColor: '#1180B7',
                  bgcolor: 'rgba(20, 157, 221, 0.04)'
                }
              }}
            >
              BACK TO HOME
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: '#fff',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: '#149DDD'
                        }}
                      >
                        {review.productName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#333' }}>
                          {review.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(review)}
                        sx={{ color: '#149DDD' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(review.id)}
                        sx={{ color: '#ff4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Rating
                    value={review.rating}
                    readOnly
                    sx={{
                      color: '#149DDD'
                    }}
                  />

                  <Typography sx={{ mt: 2, color: '#555' }}>
                    {review.comment}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Review Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedReview ? 'Edit Review' : 'Add Review'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={reviewForm.productName}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={reviewForm.rating}
                  onChange={(_, value) => handleRatingChange(value)}
                  sx={{ color: '#149DDD' }}
                />
              </Box>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={reviewForm.comment}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#149DDD',
                '&:hover': {
                  bgcolor: '#1180B7'
                }
              }}
            >
              {selectedReview ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </>
  );
};

export default Reviews; 