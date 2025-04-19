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
  Select
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

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

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      console.log('Fetching orders with params:', {
        page: page + 1,
        limit: limit
      });

      const response = await axios.get(`http://localhost:5000/api/v1/admin/orders?page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Orders API response:', {
        status: response.data.status,
        hasData: !!response.data.data,
        hasOrders: !!response.data.data?.orders,
        ordersLength: response.data.data?.orders?.length,
        total: response.data.data?.total
      });

      if (response?.data?.status === 'success' && response.data.data?.orders) {
        setOrders(response.data.data.orders);
        setTotalOrders(response.data.data.total);
      } else {
        console.error('Invalid response structure:', response.data);
        setOrders([]);
        setError('No order data received');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
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

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Contact Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="Customer Email" value={selectedOrder.userId?.email || 'Not available'} InputProps={{ readOnly: true }} fullWidth />
                  <TextField label="Phone Number" value={selectedOrder.shippingAddress?.phoneNo || 'Not provided'} InputProps={{ readOnly: true }} fullWidth />
                </Box>

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
