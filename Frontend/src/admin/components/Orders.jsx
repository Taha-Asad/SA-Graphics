// File: Orders.jsx
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
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Delete as DeleteIcon,
  CheckCircle as VerifyIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiDownload } from 'react-icons/fi';

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [paymentProofUrl, setPaymentProofUrl] = useState(null);

  // Function to fetch payment proof image
  const fetchPaymentProof = async (orderId) => {
    try {
      console.log('Fetching payment proof for order:', orderId);
      const token = localStorage.getItem('token');
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `http://localhost:5000/api/v1/orders/${orderId}/payment-proof?t=${timestamp}`;
      
      console.log('Requesting payment proof from:', url);
      
      // First try a HEAD request to check if the image exists
      try {
        await axios.head(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Image does not exist:', error);
        setPaymentProofUrl(null);
        return null;
      }

      // If HEAD request succeeds, set the direct URL
      console.log('Image exists, setting URL');
      setPaymentProofUrl(url);
      return url;
    } catch (error) {
      console.error('Error with payment proof:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      setPaymentProofUrl(null);
      return null;
    }
  };

  // Clean up blob URLs when component unmounts or when URL changes
  useEffect(() => {
    return () => {
      if (paymentProofUrl) {
        URL.revokeObjectURL(paymentProofUrl);
      }
    };
  }, [paymentProofUrl]);

  useEffect(() => {
    if (selectedOrder?._id && selectedOrder?.paymentMethod !== 'cash') {
      fetchPaymentProof(selectedOrder._id);
    } else {
      setPaymentProofUrl(null);
    }
  }, [selectedOrder?._id]);

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/v1/admin/orders?page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response?.data?.status === 'success' && response.data.data?.orders) {
        // Log the first order's data structure
        if (response.data.data.orders.length > 0) {
          const sampleOrder = response.data.data.orders[0];
          console.log('Sample Order Structure:', {
            id: sampleOrder._id,
            paymentMethod: sampleOrder.paymentMethod,
            paymentStatus: sampleOrder.paymentStatus,
            // Log all payment proof related fields
            paymentProof: sampleOrder.paymentProof,
            proofOfPayment: sampleOrder.proofOfPayment,
            paymentProofImage: sampleOrder.paymentProofImage,
            paymentReceipt: sampleOrder.paymentReceipt,
            transferProof: sampleOrder.transferProof,
            fullOrder: sampleOrder
          });
        }
        setOrders(response.data.data.orders);
        setTotalOrders(response.data.data.total);
      } else {
        console.error('Invalid response structure:', response.data);
        setOrders([]);
        setError('No order data received');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order) => {
    console.log('Order data:', order);
    setSelectedOrder(order);
    setViewMode(true);
    setOpenDialog(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setViewMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
    setViewMode(false);
  };

  const handleStatusChange = (event) => {
    if (!selectedOrder) return;
    setSelectedOrder({
      ...selectedOrder,
      status: event.target.value
    });
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) {
      toast.error('No order selected');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Updating order status:', {
        orderId: selectedOrder._id,
        status: selectedOrder.status
      });

      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/orders/${selectedOrder._id}/status`,
        { status: selectedOrder.status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Order status updated successfully');
        await fetchOrders(); // Refresh the orders list
        handleCloseDialog();
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/admin/orders/${orderToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(orders.filter(order => order._id !== orderToDelete));
      setOrderToDelete(null);
      setShowDeleteModal(false);
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const handleVerifyPayment = async (orderId, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Verifying payment:', { orderId, status });

      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/orders/${orderId}/payment-status`,
        { paymentStatus: status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment verification response:', response.data);

      if (response.data.status === 'success') {
        toast.success(response.data.message || `Payment ${status.toLowerCase()}`);
        await fetchOrders();
        handleCloseDialog();
      } else {
        throw new Error(response.data.message || 'Failed to update payment status');
      }
    } catch (err) {
      console.error('Error updating payment status:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = orderStatuses.find(s => s.value === status) || orderStatuses[0];
    return (
      <Chip
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
        icon={status === 'shipped' ? <ShippingIcon /> : undefined}
      />
    );
  };

  const PaymentProofImage = ({ order }) => {
    const [error, setError] = useState(false);

    if (!order) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    // Check all possible payment proof fields
    const proofFile = order.transferProof || order.paymentProof || order.proofOfPayment;
    
    if (!proofFile) {
      return (
        <Typography color="error" variant="body2">No payment proof found</Typography>
      );
    }

    // Construct the full URL for the image
    const imageUrl = `http://localhost:5000/uploads/payment-proofs/${proofFile}`;

    return (
      <Box sx={{ mt: 2 }}>
        {error ? (
          <Typography color="error" variant="body2">Failed to load payment proof</Typography>
        ) : (
          <>
            <Box sx={{ position: 'relative', width: '100%', mb: 1 }}>
              <img
                src={imageUrl}
                alt="Payment Proof"
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '4px',
                  display: 'block',
                  margin: '0 auto'
                }}
                onError={() => setError(true)}
              />
            </Box>
            <Button
              variant="text"
              size="small"
              fullWidth
              onClick={() => window.open(imageUrl, '_blank')}
            >
              View Full Image
            </Button>
          </>
        )}
      </Box>
    );
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
          Order Management
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={fetchOrders}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Order Management
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: '95%', margin: '0 auto' }}>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Order ID</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Customer</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Email</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Phone</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Total</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Status</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Order Date</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow hover key={order._id}>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{order.orderNumber || order._id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{order.userId?.name || 'Unknown'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{order.userId?.email || 'N/A'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{order.shippingAddress?.phoneNo || 'N/A'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>Rs. {order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{getStatusChip(order.status)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', p: 2 }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', p: 2 }} align="right">
                      <IconButton color="info" size="small" onClick={() => handleViewOrder(order)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="primary" size="small" onClick={() => handleEditOrder(order)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => {
                          setOrderToDelete(order._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No orders found
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
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{viewMode ? 'Order Details' : 'Edit Order'}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Order Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="Order ID" value={selectedOrder.orderNumber || selectedOrder._id} InputProps={{ readOnly: true }} fullWidth />
                  <TextField label="Customer" value={selectedOrder.userId?.name || 'Unknown'} InputProps={{ readOnly: true }} fullWidth />
                  <TextField
                    select
                    label="Status"
                    value={selectedOrder.status}
                    onChange={handleStatusChange}
                    fullWidth
                    disabled={viewMode}
                  >
                    {orderStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField label="Order Date" value={new Date(selectedOrder.createdAt).toLocaleDateString()} InputProps={{ readOnly: true }} fullWidth />
                </Box>

                <Typography variant="subtitle2">Contact Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="Customer Email" value={selectedOrder.userId?.email || 'Not available'} InputProps={{ readOnly: true }} fullWidth />
                  <TextField label="Phone Number" value={selectedOrder.shippingAddress?.phoneNo || 'Not provided'} InputProps={{ readOnly: true }} fullWidth />
                </Box>

                {selectedOrder?.paymentMethod !== 'cash' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Information
                    </Typography>
                    
                    {/* Payment Method and Status */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Payment Method"
                          value={selectedOrder.paymentMethod}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Payment Status"
                          value={selectedOrder.paymentStatus === 'pending' ? 'unverified' : selectedOrder.paymentStatus}
                          fullWidth
                          InputProps={{ 
                            readOnly: true,
                            sx: {
                              color: selectedOrder.paymentStatus === 'verified' ? 'success.main' : 
                                    selectedOrder.paymentStatus === 'rejected' ? 'error.main' : 'warning.main'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Verify/Reject Buttons */}
                    {!viewMode && (selectedOrder.paymentStatus === 'pending' || selectedOrder.paymentStatus === 'unverified') && (
                      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<VerifyIcon />}
                          onClick={() => handleVerifyPayment(selectedOrder._id, 'verified')}
                        >
                          Verify Payment
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() => handleVerifyPayment(selectedOrder._id, 'rejected')}
                        >
                          Reject Payment
                        </Button>
                      </Box>
                    )}

                    {/* Show status message if already verified or rejected */}
                    {!viewMode && selectedOrder.paymentStatus !== 'pending' && selectedOrder.paymentStatus !== 'unverified' && (
                      <Alert 
                        severity={selectedOrder.paymentStatus === 'verified' ? 'success' : 'error'}
                        sx={{ mb: 2 }}
                      >
                        Payment has been {selectedOrder.paymentStatus}
                      </Alert>
                    )}

                    {/* Payment Proof Image */}
                    {selectedOrder?.paymentMethod !== 'cash' && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Payment Proof
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2,
                            bgcolor: '#f5f5f5',
                            maxWidth: 400,
                            margin: '0 auto'
                          }}
                        >
                          <PaymentProofImage order={selectedOrder} />
                        </Paper>
                      </Box>
                    )}
                  </Box>
                )}

                <Typography variant="subtitle2">Items</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.title || item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">Rs. {item.price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell align="right">Rs. {(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                        <TableCell align="right"><strong>Rs. {selectedOrder.totalAmount?.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {selectedOrder.shippingAddress && (
                  <>
                    <Typography variant="subtitle2">Shipping Address</Typography>
                    <TextField
                      multiline
                      rows={2}
                      value={`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.province}, ${selectedOrder.shippingAddress.postalCode}`}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{viewMode ? 'Close' : 'Cancel'}</Button>
          {!viewMode && <Button onClick={handleUpdateOrder} variant="contained">Save Changes</Button>}
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
