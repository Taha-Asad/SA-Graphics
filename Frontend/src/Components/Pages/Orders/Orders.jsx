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
import axios from 'axios';
import { toast } from 'react-toastify';
import { BiPackage } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

const API_URL = 'http://localhost:5000/api/v1';

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

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If no user after auth load completes, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          setOrders(response.data.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch orders. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user, authLoading]);

  const handleTrackOrder = (orderId) => {
    localStorage.setItem('lastOrderId', orderId);
    navigate(`/track-order/${orderId}`);
  };

  // Show loading while either auth or orders are loading
  if (authLoading || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Typography variant="h4" component="h1">
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
          <BiPackage size={64} style={{ color: '#9e9e9e', marginBottom: '16px' }} />
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Looks like you haven't placed any orders yet.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                  const booksTab = document.querySelector('[value="2"]');
                  if (booksTab) {
                    booksTab.click();
                  }
                }
              }, 500);
            }}
            sx={{ mt: 3 }}
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
                  <Typography variant="h6">
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
                    {order.item.map((item, index) => (
                      <Box 
                        key={item._id || index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mb: index !== order.item.length - 1 ? 2 : 0
                        }}
                      >
                        <Box
                          component="img"
                          src={item.bookId?.image ? `http://localhost:5000/uploads/${item.bookId.image}` : '/placeholder-book.jpg'}
                          alt={item.bookId?.title || 'Book'}
                          sx={{
                            width: 60,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 2
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {item.bookId?.title || 'Book Title'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {item.quantity} × Rs. {item.price}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Total Items: {order.item.reduce((acc, item) => acc + item.quantity, 0)}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Total: Rs. {order.totalAmount}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handleTrackOrder(order._id)}
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