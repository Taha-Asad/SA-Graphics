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
  TablePagination,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const Testimonials = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [testimonials, setTestimonials] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    content: '',
    rating: 5,
    jobTitle: '',
    isApproved: true,
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockTestimonials = [
      {
        id: 1,
        userId: 'John Doe',
        content: 'Great service!',
        rating: 5,
        jobTitle: 'Software Engineer',
        isApproved: true,
        createdAt: '2024-03-15',
      },
      {
        id: 2,
        userId: 'Jane Smith',
        content: 'Excellent work!',
        rating: 4,
        jobTitle: 'Product Manager',
        isApproved: false,
        createdAt: '2024-03-14',
      },
    ];
    setTestimonials(mockTestimonials);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (testimonial = null) => {
    if (testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({
        userId: testimonial.userId,
        content: testimonial.content,
        rating: testimonial.rating,
        jobTitle: testimonial.jobTitle,
        isApproved: testimonial.isApproved,
      });
    } else {
      setSelectedTestimonial(null);
      setFormData({
        userId: '',
        content: '',
        rating: 5,
        jobTitle: '',
        isApproved: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTestimonial(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedTestimonial) {
        // Update testimonial API call
        console.log('Updating testimonial:', formData);
      } else {
        // Create testimonial API call
        console.log('Creating testimonial:', formData);
      }
      handleCloseDialog();
      // Refresh testimonials list
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        // Delete testimonial API call
        console.log('Deleting testimonial:', testimonialId);
        // Refresh testimonials list
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const handleApprove = async (testimonialId) => {
    try {
      // Approve testimonial API call
      console.log('Approving testimonial:', testimonialId);
      // Refresh testimonials list
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Testimonials Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Testimonial
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>{testimonial.userId}</TableCell>
                  <TableCell>{testimonial.content}</TableCell>
                  <TableCell>
                    <Rating value={testimonial.rating} readOnly />
                  </TableCell>
                  <TableCell>{testimonial.jobTitle}</TableCell>
                  <TableCell>
                    <Chip
                      icon={testimonial.isApproved ? <CheckCircleIcon /> : <CancelIcon />}
                      label={testimonial.isApproved ? 'Approved' : 'Pending'}
                      color={testimonial.isApproved ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{testimonial.createdAt}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(testimonial)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(testimonial.id)}>
                      <DeleteIcon />
                    </IconButton>
                    {!testimonial.isApproved && (
                      <IconButton onClick={() => handleApprove(testimonial.id)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={testimonials.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="User ID"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              margin="normal"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography component="legend">Rating:</Typography>
              <Rating
                value={formData.rating}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, rating: newValue });
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTestimonial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Testimonials; 