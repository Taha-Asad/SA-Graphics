import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    paymentMethod: 'cash'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.deliveryAddress) {
      toast.error('Please provide a delivery address');
      return;
    }

    try {
      setLoading(true);
      
      // Parse the delivery address into components
      const addressParts = formData.deliveryAddress.split(',').map(part => part.trim());
      
      // Create order data that matches the backend model schema
      const orderData = {
        item: cartItems.map(item => ({
          bookId: item._id || item.id, // Handle both _id and id
          quantity: item.quantity,
          price: item.price,
          title: item.title,
          image: item.image
        })),
        totalAmount: getCartTotal(),
        shippingAddress: {
          street: addressParts[0] || formData.deliveryAddress,
          city: addressParts[1] || 'Not specified',
          province: addressParts[2] || 'Not specified',
          postalCode: addressParts[3] || 'Not specified'
        },
        paymentMethod: formData.paymentMethod
      };

      console.log('Sending order data:', orderData); // Debug log

      const response = await axios.post(
        'http://localhost:5000/api/v1/orders',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/track-order/${response.data.data.order._id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to place order';
      toast.error(errorMessage);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, minHeight: '80vh' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#1e242c',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              mt: 2,
              backgroundColor: '#149ddd',
              '&:hover': { backgroundColor: '#1187c1' },
              px: 4,
              py: 1.5,
              borderRadius: 2
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '80vh' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          color: 'white',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              backgroundColor: '#1e242c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'white',
                mb: 3,
                fontWeight: 500
              }}
            >
              Delivery Address
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="deliveryAddress"
              label="Enter your complete delivery address"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              sx={{
                mb: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#149ddd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#149ddd',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'white',
                mb: 2,
                fontWeight: 500
              }}
            >
              Payment Method
            </Typography>
            <RadioGroup
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <FormControlLabel 
                value="cash" 
                control={
                  <Radio 
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#149ddd',
                      },
                    }}
                  />
                } 
                label="Cash on Delivery" 
                sx={{ 
                  color: 'white',
                  '& .MuiTypography-root': {
                    fontWeight: 400
                  }
                }}
              />
            </RadioGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              backgroundColor: '#1e242c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              position: 'sticky',
              top: 24
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'white',
                mb: 3,
                fontWeight: 500
              }}
            >
              Order Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              {cartItems.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 2,
                    py: 1
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {item.title} × {item.quantity}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ 
              my: 3, 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderStyle: 'dashed'
            }} />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 4,
              py: 1
            }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Total:</Typography>
              <Typography variant="h6" sx={{ color: '#149ddd', fontWeight: 600 }}>
                Rs. {getCartTotal().toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: '#149ddd',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#1187c1'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(20, 157, 221, 0.5)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Place Order'
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 