import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Container,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import * as testimonialService from '../../services/testimonialService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialService.getAllTestimonials();
      console.log('Testimonials response:', response); // Debug log
      
      // Ensure we always set an array
      setTestimonials(Array.isArray(response) ? response : []);
      
      if (!Array.isArray(response) || response.length === 0) {
        setError('No testimonials found.');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Failed to fetch testimonials');
      setTestimonials([]); // Ensure testimonials is always an array
      setSnackbar({
        open: true,
        message: err.message || 'Failed to fetch testimonials',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (testimonialId) => {
    try {
      await testimonialService.approveTestimonial(testimonialId);
      setSnackbar({
        open: true,
        message: 'Testimonial approved successfully',
        severity: 'success'
      });
      fetchTestimonials();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to approve testimonial',
        severity: 'error'
      });
    }
  };

  const handleReject = async (testimonialId) => {
    try {
      await testimonialService.rejectTestimonial(testimonialId);
      setSnackbar({
        open: true,
        message: 'Testimonial rejected successfully',
        severity: 'success'
      });
      fetchTestimonials();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to reject testimonial',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await testimonialService.deleteTestimonial(selectedTestimonial._id);
      setSnackbar({
        open: true,
        message: 'Testimonial deleted successfully',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
      setSelectedTestimonial(null);
      fetchTestimonials();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete testimonial',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
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
          Manage Testimonials
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchTestimonials}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <Grid item xs={12} md={6} key={testimonial._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        {testimonial.user?.name || 'Anonymous'}
                      </Typography>
                      <Chip 
                        label={testimonial.status} 
                        color={getStatusColor(testimonial.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {testimonial.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Submitted on: {new Date(testimonial.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {testimonial.status !== 'approved' && (
                      <IconButton 
                        onClick={() => handleApprove(testimonial._id)}
                        color="success"
                        title="Approve"
                      >
                        <ApproveIcon />
                      </IconButton>
                    )}
                    {testimonial.status !== 'rejected' && (
                      <IconButton 
                        onClick={() => handleReject(testimonial._id)}
                        color="error"
                        title="Reject"
                      >
                        <RejectIcon />
                      </IconButton>
                    )}
                    <IconButton 
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No testimonials found.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this testimonial? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default Testimonials; 