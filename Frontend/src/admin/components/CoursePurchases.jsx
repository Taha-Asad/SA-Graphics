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
  TextField,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const CoursePurchases = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchCourseOrders();
  }, [page, rowsPerPage]);

  const fetchCourseOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      console.log('Fetching course orders with params:', {
        page: page + 1,
        limit: rowsPerPage,
        orderType: 'course'
      });

      const response = await axios.get(`http://localhost:5000/api/v1/admin/orders?page=${page + 1}&limit=${rowsPerPage}&orderType=course`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Course orders API response:', {
        status: response.data.status,
        hasData: !!response.data.data,
        hasOrders: !!response.data.data?.orders,
        ordersLength: response.data.data?.orders?.length,
        total: response.data.data?.total,
        firstOrder: response.data.data?.orders?.[0]
      });

      if (response?.data?.status === 'success' && response.data.data?.orders) {
        console.log('Setting orders:', response.data.data.orders);
        setOrders(response.data.data.orders);
        setTotalOrders(response.data.data.total);
      } else {
        console.error('Invalid response structure:', response.data);
        setOrders([]);
        setError('No course order data received');
      }
    } catch (err) {
      console.error('Error fetching course orders:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      setOrders([]);
      setError(err.message || 'Failed to load course orders');
      toast.error('Failed to load course orders');
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
  };

  const handleSendEmail = async (order) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/v1/admin/send-email`, {
        orderId: order._id,
        type: 'course-purchase'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.message === 'Email sent successfully') {
        toast.success('Email sent successfully');
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || 'Failed to send email');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error setting up email request');
      }
    }
  };

  if (loading && orders.length === 0) {
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
          Course Purchases
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={fetchCourseOrders}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Course Purchases
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: '95%', margin: '0 auto' }}>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Order ID</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Customer</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Email</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Course</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Amount</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Purchase Date</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const courseItem = order.items.find(item => item.type === 'course');
                  return (
                    <TableRow hover key={order._id}>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        {order.orderNumber || order._id}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        {order.shippingAddress.name}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        {order.shippingAddress.email}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        {courseItem?.title || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', p: 2 }} align="right">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleSendEmail(order)}
                        >
                          <EmailIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No course purchases found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Course Purchase Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Order Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Order ID"
                    value={selectedOrder.orderNumber || selectedOrder._id}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                  <TextField
                    label="Purchase Date"
                    value={new Date(selectedOrder.createdAt).toLocaleDateString()}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>

                <Typography variant="subtitle2">Customer Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Customer Name"
                    value={selectedOrder.shippingAddress.name}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    value={selectedOrder.shippingAddress.email}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={selectedOrder.shippingAddress.phoneNo}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>

                <Typography variant="subtitle2">Course Details</Typography>
                {selectedOrder.items.map((item, index) => (
                  item.type === 'course' && (
                    <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Course Name"
                        value={item.title}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                      <TextField
                        label="Price"
                        value={`Rs. ${item.price?.toFixed(2)}`}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Box>
                  )
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button
            onClick={() => handleSendEmail(selectedOrder)}
            variant="contained"
            startIcon={<EmailIcon />}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursePurchases; 