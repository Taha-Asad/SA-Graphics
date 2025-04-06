import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  CircularProgress
} from '@mui/material';
import { Check, Close, Delete } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, testimonialId: null });

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials...');
      const response = await axios.get(`${BASE_URL}/admin/testimonials`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Testimonials response:', response.data);
      
      // Check if response.data is an array or if it has a nested data property
      const testimonialsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      console.log('Processed testimonials data:', testimonialsData);
      
      setTestimonials(testimonialsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error.response || error);
      const message = error.response?.data?.message || 'Failed to fetch testimonials';
      setError(message);
      setTestimonials([]);
      setLoading(false);
      showSnackbar(message, 'error');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle testimonial approval
  const handleApprove = async (id) => {
    try {
      await axios.put(`${BASE_URL}/admin/testimonials/${id}`, { status: 'approved' }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      showSnackbar('Testimonial approved successfully', 'success');
      fetchTestimonials();
    } catch (error) {
      console.error('Approve error:', error.response || error);
      const message = error.response?.data?.message || 'Failed to approve testimonial';
      showSnackbar(message, 'error');
    }
  };

  // Handle testimonial rejection
  const handleReject = async (id) => {
    try {
      await axios.put(`${BASE_URL}/admin/testimonials/${id}`, { status: 'rejected' }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      showSnackbar('Testimonial rejected successfully', 'success');
      fetchTestimonials();
    } catch (error) {
      console.error('Reject error:', error.response || error);
      const message = error.response?.data?.message || 'Failed to reject testimonial';
      showSnackbar(message, 'error');
    }
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, testimonialId: id });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/admin/testimonials/${deleteDialog.testimonialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      showSnackbar('Testimonial deleted successfully', 'success');
      fetchTestimonials();
    } catch (error) {
      console.error('Delete error:', error.response || error);
      const message = error.response?.data?.message || 'Failed to delete testimonial';
      showSnackbar(message, 'error');
    }
    setDeleteDialog({ open: false, testimonialId: null });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manage Testimonials
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : testimonials.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No testimonials found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial._id}>
                  <TableCell>
                    {testimonial.userId?.name || testimonial.name || 'Anonymous'}
                  </TableCell>
                  <TableCell>{testimonial.text || testimonial.message || 'No message'}</TableCell>
                  <TableCell>
                    <Chip
                      label={testimonial.status || 'pending'}
                      color={
                        testimonial.status === 'approved'
                          ? 'success'
                          : testimonial.status === 'rejected'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {(!testimonial.status || testimonial.status === 'pending') && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleApprove(testimonial._id)}
                          title="Approve"
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleReject(testimonial._id)}
                          title="Reject"
                        >
                          <Close />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(testimonial._id)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, testimonialId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this testimonial? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, testimonialId: null })}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Testimonials; 