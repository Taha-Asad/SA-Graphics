import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BiPackage, BiReceipt } from 'react-icons/bi';
import { FiHome, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../config/axios';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { bg: '#fff3e0', text: '#e65100' };
    case 'processing':
      return { bg: '#e3f2fd', text: '#1565c0' };
    case 'shipped':
      return { bg: '#e8f5e9', text: '#2e7d32' };
    case 'delivered':
      return { bg: '#e8f5e9', text: '#1b5e20' };
    case 'cancelled':
      return { bg: '#ffebee', text: '#c62828' };
    default:
      return { bg: '#f5f5f5', text: '#616161' };
  }
};

const PaymentProofImage = ({ orderId }) => {
  const [error, setError] = useState(false);
  const baseUrl = 'http://localhost:5000/api/v1';

  return (
    <Box sx={{ mt: 2 }}>
      {error ? (
        <Typography color="error" variant="body2">Failed to load payment proof</Typography>
      ) : (
        <>
          <img
            src={`${baseUrl}/orders/${orderId}/payment-proof`}
            alt="Payment Proof"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
            onError={() => setError(true)}
          />
          <Button
            variant="text"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => window.open(`${baseUrl}/orders/${orderId}/payment-proof`, '_blank')}
          >
            View Full Image
          </Button>
        </>
      )}
    </Box>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        
        const response = await axiosInstance.get('/orders/my-orders');
        console.log('Orders response:', response.data);

        if (response.data.status === 'success') {
          const ordersData = response.data.data.orders || [];
          setOrders(ordersData);
        } else {
          console.error('Failed to fetch orders:', response.data);
          toast.error(response.data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error.response || error);
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to fetch orders. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user, authLoading]);

  const handleTrackOrder = (orderId) => {
    localStorage.setItem('lastOrderId', orderId);
    navigate(`/account/track-order/${orderId}`);
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress sx={{ color: '#149ddd' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative'}}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
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
        <Typography variant="h4" component="h1" sx={{ color: '#149ddd' }}>
          My Orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <BiPackage size={64} style={{ color: '#149ddd', marginBottom: '16px' }} />
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Looks like you haven't placed any orders yet.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ 
              mt: 3,
              bgcolor: '#149ddd',
              '&:hover': {
                bgcolor: '#1187c1'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#149ddd' }}>
                    Order #{order._id.slice(-8)}
                  </Typography>
                  <Chip 
                    label={order.status}
                    sx={{ 
                      bgcolor: getStatusColor(order.status).bg,
                      color: getStatusColor(order.status).text,
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    {order.items.map((item, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mb: index !== order.items.length - 1 ? 2 : 0
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image || '/placeholder-service.jpg'}
                          alt={item.title}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 2
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#149ddd' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {item.quantity} × Rs. {item.price}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Total Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Payment Method: {order.paymentMethod}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Payment Status: {order.paymentStatus}
                      </Typography>
                      {order.paymentMethod !== 'cash' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Payment Proof:
                          </Typography>
                          <PaymentProofImage orderId={order._id} />
                        </Box>
                      )}
                      <Typography variant="h6" sx={{ mt: 2, color: '#149ddd' }}>
                        Total: Rs. {order.totalAmount}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleTrackOrder(order._id)}
                        sx={{ 
                          mt: 2,
                          bgcolor: '#149ddd',
                          '&:hover': {
                            bgcolor: '#1187c1'
                          }
                        }}
                      >
                        Track Order
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders; 