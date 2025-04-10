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
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/adminService';

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, orderId: null });

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders(page + 1, rowsPerPage);
      if (response && response.data) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.total || 0);
      } else {
        setOrders([]);
        setError('No orders data received');
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
    setRowsPerPage(parseInt(event.target.value, 10));
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

  const handleUpdateOrder = async () => {
    if (!selectedOrder || !selectedOrder.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      setLoading(true);
      const result = await updateOrderStatus(selectedOrder._id, selectedOrder.status);
      if (result.status === 'success') {
        toast.success('Order status updated successfully');
        await fetchOrders();
        handleCloseDialog();
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(confirmDialog.orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order');
    } finally {
      setConfirmDialog({ open: false, orderId: null });
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

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow hover key={order._id}>
                    <TableCell>{order.orderNumber || order._id}</TableCell>
                    <TableCell>{order.userId?.name || 'Unknown'}</TableCell>
                    <TableCell>${order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
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
                        onClick={() => handleEditOrder(order)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setConfirmDialog({ open: true, orderId: order._id })}
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
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {orders && orders.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* View/Edit Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'Order Details' : 'Edit Order'}
        </DialogTitle>
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
                    label="Customer"
                    value={selectedOrder.userId?.name || 'Unknown'}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Status"
                    value={selectedOrder.status}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    fullWidth
                    disabled={viewMode}
                  >
                    {orderStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Order Date"
                    value={new Date(selectedOrder.createdAt).toLocaleDateString()}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
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
                      {selectedOrder.item?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.title || item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell align="right">
                            ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>Total:</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</strong>
                        </TableCell>
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
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          {!viewMode && (
            <Button onClick={handleUpdateOrder} variant="contained">
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, orderId: null })}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, orderId: null })}>
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

export default Orders; 