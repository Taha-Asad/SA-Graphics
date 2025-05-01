import React, { useState, useEffect } from 'react';
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
  Divider,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  FormLabel,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa';
import { DeleteOutline } from '@mui/icons-material';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNo: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [transferProof, setTransferProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const calculateCharityAmount = (total) => {
    return total * 0.025; // 2.5% charity
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const charity = calculateCharityAmount(subtotal);
    return subtotal + charity;
  };

  useEffect(() => {
    if (user) {
      setDeliveryAddress(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phoneNo: user.phoneNo || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        province: user.address?.province || '',
        postalCode: user.address?.postalCode || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'paymentMethod') {
      setSelectedPaymentMethod(value);
      if (value === 'cash') {
        setTransferProof(null);
      }
    } else if (name === 'transferProof') {
      setTransferProof(e.target.files[0]);
    } else {
      setDeliveryAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // const copyToClipboard = (text) => {
  //   navigator.clipboard.writeText(text);
  //   toast.success('Copied to clipboard!');
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!deliveryAddress.street || !deliveryAddress.city || 
          !deliveryAddress.province || !deliveryAddress.postalCode) {
        toast.error("Please fill in all address fields");
        setLoading(false);
        return;
      }

      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        setLoading(false);
        return;
      }

      // Check if transfer proof is required for non-cash payments
      if ((selectedPaymentMethod === 'transfer' || selectedPaymentMethod === 'jazzcash') && !transferProof) {
        toast.error("Please upload payment proof");
        setLoading(false);
        return;
      }

      const formattedItems = cartItems.map(item => ({
        _id: item._id,
          title: item.title,
          price: item.price,
        quantity: item.quantity || 1,
        type: item.type || 'product',
        thumbnail: item.thumbnail || null,
        discount: item.discount || null,
        discountedPrice: item.discountedPrice || null
      }));

      const subtotal = getCartTotal();
      const charityAmount = calculateCharityAmount(subtotal);
      const finalTotal = getFinalTotal();

      const orderData = {
        items: formattedItems,
        subtotal: Number(subtotal),
        charityAmount: Number(charityAmount),
        totalAmount: Number(finalTotal),
        shippingAddress: {
          name: user.name,
          email: user.email,
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          province: deliveryAddress.province,
          postalCode: deliveryAddress.postalCode,
          phoneNo: deliveryAddress.phoneNo || user.phoneNo || ''
        },
        userId: user._id.toString(),
        paymentMethod: selectedPaymentMethod,
        paymentStatus: 'pending',
        status: 'pending'
      };

      console.log('Submitting order data:', orderData);

      let requestData;
      let config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (selectedPaymentMethod === 'cash') {
        requestData = orderData;
        config.headers['Content-Type'] = 'application/json';
      } else {
        const formData = new FormData();
        formData.append('order', JSON.stringify(orderData));
        if (transferProof) {
          formData.append('transferProof', transferProof);
        }
        requestData = formData;
      }

        const response = await axios.post(
          'http://localhost:5000/api/v1/orders',
          requestData,
          config
        );

        console.log('Order response:', response.data);

        if (response.data.status === 'success') {
          setOrderSuccess(true);
          setOrderId(response.data.data.order._id);
        toast.success(response.data.message || "Order placed successfully!");
          clearCart();
        
        // Check if it's a course order from the response
        const isCourseOrder = response.data.data.isCourseOrder;
        
        if (isCourseOrder) {
          // For course orders, redirect to home page
          navigate('/');
        } else {
          // For regular orders, go to track order page
          navigate(`/account/track-order/${response.data.data.order._id}`);
        }
        }
      } catch (error) {
        console.error('Order submission error:', error);
        console.error('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.message || "Failed to place order";
        toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderId) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, minHeight: '80vh', mt: 10 }}>
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
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
            Your order has been placed successfully. You can track your order using the button below.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/account/track-order/${orderId}`)}
              sx={{
                backgroundColor: '#149ddd',
                '&:hover': { backgroundColor: '#1187c1' },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Track Order
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                borderColor: '#149ddd',
                color: '#149ddd',
                '&:hover': { 
                  borderColor: '#1187c1',
                  backgroundColor: 'rgba(20, 157, 221, 0.04)'
                },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, minHeight: '80vh' , mt: 10}}>
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
    <Box sx={{ 
      minHeight: '100vh', 
      py: 4,
      background: '#1e242c'
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600, 
          color: 'white',
          mb: 4,
          textAlign: 'center'
        }}>
        Checkout
      </Typography>
      
        <Grid container spacing={4}>
          {/* Shipping Information */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 2,
              background: '#1e242c',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                  color: 'white',
                fontWeight: 600,
                mb: 3
              }}>
                Shipping Information
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                      label="Name"
                      name="name"
                      value={deliveryAddress.name}
                    onChange={handleInputChange}
                      required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#149ddd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#149ddd',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={deliveryAddress.email}
                    onChange={handleInputChange}
                      required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#149ddd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#149ddd',
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
                </Grid>
                  <Grid item xs={12}>
                  <TextField
                    fullWidth
                      label="Phone Number"
                      name="phoneNo"
                      value={deliveryAddress.phoneNo}
                    onChange={handleInputChange}
                      required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#149ddd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#149ddd',
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
                </Grid>
                  <Grid item xs={12}>
                  <TextField
                    fullWidth
                      label="Street Address"
                      name="street"
                      value={deliveryAddress.street}
                    onChange={handleInputChange}
                      required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#149ddd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#149ddd',
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                      label="City"
                      name="city"
                      value={deliveryAddress.city}
                    onChange={handleInputChange}
                      required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#149ddd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#149ddd',
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
                </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Province"
                      name="province"
                      value={deliveryAddress.province}
                      onChange={handleInputChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#149ddd',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#149ddd',
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="postalCode"
                      value={deliveryAddress.postalCode}
                      onChange={handleInputChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#149ddd',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#149ddd',
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
                  </Grid>
                </Grid>
              </form>
            </Paper>
              </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 2,
              background: '#1e242c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              position: 'sticky',
              top: 20
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'white',
                fontWeight: 600,
                mb: 3
              }}>
                Order Summary
              </Typography>

              <List>
                {cartItems.map((item) => (
                  <ListItem key={item._id} sx={{ 
                    py: 1,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <ListItemAvatar>
                      <Avatar 
                        src={item.thumbnail} 
                        alt={item.title}
                sx={{ 
                          width: 60, 
                          height: 60,
                          borderRadius: 1
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: 'white' }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Quantity: {item.quantity}
                        </Typography>
                      }
                      sx={{ ml: 2 }}
                    />
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      color: '#149ddd'
                    }}>
                      Rs. {item.price * item.quantity}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel component="legend" sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  mb: 2
                }}>
                Payment Method
                </FormLabel>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={handleInputChange}
                  name="paymentMethod"
              >
                <FormControlLabel
                  value="cash"
                    control={
                      <Radio sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: '#149ddd',
                        },
                      }} />
                    }
                    label={
                      <Typography sx={{ color: 'white' }}>
                        Cash on Delivery
                      </Typography>
                    }
                />
                <FormControlLabel
                  value="transfer"
                    control={
                      <Radio sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: '#149ddd',
                        },
                      }} />
                    }
                    label={
                      <Typography sx={{ color: 'white' }}>
                        Bank Transfer
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="jazzcash"
                    control={
                      <Radio sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: '#149ddd',
                        },
                      }} />
                    }
                    label={
                      <Typography sx={{ color: 'white' }}>
                        Jazz Cash
                      </Typography>
                    }
                />
              </RadioGroup>
              </FormControl>

              {(selectedPaymentMethod === 'transfer' || selectedPaymentMethod === 'jazzcash') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Please transfer the amount to:
                  </Typography>
                  {selectedPaymentMethod === 'transfer' ? (
                    <>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Bank: HBL
                        </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Account Number: 1234567890
                          </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Account Name: SA Graphics
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Jazz Cash Number: 03XX-XXXXXXX
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Account Name: SA Graphics
                      </Typography>
                    </>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                          Upload Payment Proof
                      </Typography>
                      <input
                          accept="image/*"
                          type="file"
                      id="payment-proof"
                          name="transferProof"
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                      />
                    <label htmlFor="payment-proof">
                          <Button
                              variant="outlined"
                              component="span"
                              sx={{
                                  color: 'white',
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                  '&:hover': {
                                      borderColor: '#149ddd',
                                      backgroundColor: 'rgba(20, 157, 221, 0.08)'
                                  }
                              }}
                          >
                              {transferProof ? 'Change File' : 'Choose File'}
                          </Button>
                      </label>
                    {transferProof && (
                      <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
                        File selected: {transferProof.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 1
                }}>
                  Subtotal: Rs. {getCartTotal()}
                    </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 1
                }}>
                  Charity (2.5%): Rs. {calculateCharityAmount(getCartTotal())}
                    </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'white'
                }}>
                  Final Total: Rs. {getFinalTotal()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: '#149ddd',
                  '&:hover': {
                    background: '#1187c1',
                  },
                }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
    </Container>
    </Box>
  );
};

export default Checkout; 