import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Stack,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Block as RejectIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getReviews, updateReviewStatus, deleteReview } from '../../services/adminService';

const BASE_URL = 'http://localhost:5000';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, reviewId: null });

  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReviews(page + 1, rowsPerPage);
      if (response && response.data) {
        setReviews(response.data.reviews);
        setTotalReviews(response.data.total || 0);
      } else {
        setReviews([]);
        setError('No reviews data received');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
      setError(err.message || 'Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedReview(null);
    setOpenDialog(false);
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await updateReviewStatus(reviewId, 'approved');
      toast.success('Review approved successfully');
      fetchReviews();
    } catch (err) {
      console.error('Error approving review:', err);
      toast.error('Failed to approve review');
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await updateReviewStatus(reviewId, 'rejected');
      toast.success('Review rejected successfully');
      fetchReviews();
    } catch (err) {
      console.error('Error rejecting review:', err);
      toast.error('Failed to reject review');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(confirmDialog.reviewId);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    } finally {
      setConfirmDialog({ open: false, type: null, reviewId: null });
    }
  };

  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return null;
    if (profilePic.startsWith('http')) return profilePic;
    return `${BASE_URL}/uploads/${profilePic}`;
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning' },
      approved: { label: 'Approved', color: 'success' },
      rejected: { label: 'Rejected', color: 'error' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Review Management
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={fetchReviews}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5 , mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Review Management
      </Typography>

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <TableRow hover key={review._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={getProfilePicUrl(review.user?.profilePic)} 
                          alt={review.user?.name}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: review.user?.profilePic ? 'transparent' : 'primary.main'
                          }}
                        >
                          {!review.user?.profilePic && <PersonIcon />}
                        </Avatar>
                        <Typography>{review.user?.name || 'Unknown User'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{review.service?.name || review.productName || 'N/A'}</TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>{getStatusChip(review.status)}</TableCell>
                    <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleViewReview(review)}
                      >
                        <ViewIcon />
                      </IconButton>
                      {review.status === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleApproveReview(review._id)}
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => handleRejectReview(review._id)}
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setConfirmDialog({ open: true, reviewId: review._id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No reviews found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {reviews && reviews.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalReviews}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* View Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={getProfilePicUrl(selectedReview.user?.profilePic)}
                  alt={selectedReview.user?.name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: selectedReview.user?.profilePic ? 'transparent' : 'primary.main'
                  }}
                >
                  {!selectedReview.user?.profilePic && <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedReview.user?.name || 'Unknown User'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Service
                </Typography>
                <Typography>{selectedReview.service?.name || selectedReview.productName || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Rating
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Comment
                </Typography>
                <Typography>{selectedReview.comment}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                {getStatusChip(selectedReview.status)}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedReview?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleApproveReview(selectedReview._id)}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleRejectReview(selectedReview._id)}
                color="warning"
                variant="contained"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, reviewId: null })}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, reviewId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews; 