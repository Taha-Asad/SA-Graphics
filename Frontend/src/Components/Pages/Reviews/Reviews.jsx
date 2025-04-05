import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Avatar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { FiEdit2, FiTrash2, FiHome } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [editingReview, setEditingReview] = useState(null);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/reviews/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({
        rating: review.rating,
        comment: review.comment
      });
    } else {
      setEditingReview(null);
      setReviewForm({
        rating: 5,
        comment: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReview(null);
    setReviewForm({
      rating: 5,
      comment: ''
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingReview) {
        // Update existing review
        await axios.put(
          `http://localhost:5000/api/v1/reviews/${editingReview._id}`,
          reviewForm,
          config
        );
        toast.success('Review updated successfully');
      } else {
        // Create new review
        await axios.post(
          'http://localhost:5000/api/v1/reviews',
          reviewForm,
          config
        );
        toast.success('Review added successfully');
      }

      handleCloseDialog();
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FiHome />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#149ddd',
              color: '#149ddd',
              '&:hover': {
                borderColor: '#1187c1',
                backgroundColor: 'rgba(20, 157, 221, 0.04)'
              }
            }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            My Reviews
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#149ddd',
            '&:hover': { backgroundColor: '#1187c1' }
          }}
        >
          Add Review
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          You haven't written any reviews yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {reviews.map((review) => (
            <Card key={review._id} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user?.profilePic} alt={user?.name} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {user?.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(review)}
                      sx={{ mr: 1 }}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteReview(review._id)}
                      color="error"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingReview ? 'Edit Review' : 'Add Review'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={reviewForm.rating}
              onChange={(event, newValue) => {
                setReviewForm(prev => ({ ...prev, rating: newValue }));
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            sx={{
              backgroundColor: '#149ddd',
              '&:hover': { backgroundColor: '#1187c1' }
            }}
          >
            {editingReview ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews; 