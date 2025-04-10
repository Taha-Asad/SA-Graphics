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
  Input,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUpload, FaCopy } from 'react-icons/fa';
import { DeleteOutline } from '@mui/icons-material';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState({
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

  useEffect(() => {
    if (user && user.address && !deliveryAddress.street) {
      setDeliveryAddress(prev => ({
        ...prev,
        phoneNo: user.phoneNo || ''
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to place an order");
        navigate('/login');
        return;
      }

      // Validate address fields
      if (!deliveryAddress.street || !deliveryAddress.city || 
          !deliveryAddress.province || !deliveryAddress.postalCode) {
        toast.error("Please fill in all address fields");
        return;
      }

      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        return;
      }

      // Check if transfer proof is required for non-cash payments
      if (selectedPaymentMethod !== 'cash' && !transferProof) {
        toast.error("Please upload payment proof for online payment");
        return;
      }

      // Create order data
      const orderData = {
        item: cartItems.map(item => ({
          bookId: item._id,
          title: item.title,
          image: item.coverImage,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        shippingAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          province: deliveryAddress.province,
          postalCode: deliveryAddress.postalCode
        },
        paymentMethod: selectedPaymentMethod
      };

      console.log('Sending order data:', orderData);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': selectedPaymentMethod === 'cash' ? 'application/json' : 'multipart/form-data'
        }
      };

      let requestData;
      if (selectedPaymentMethod === 'cash') {
        requestData = orderData;
      } else {
        const formData = new FormData();
        formData.append('order', JSON.stringify(orderData));
        formData.append('transferProof', transferProof);
        requestData = formData;
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/orders',
        requestData,
        config
      );

      if (response.data.status === 'success') {
        setOrderSuccess(true);
        setOrderId(response.data.data.order._id);
        toast.success("Order placed successfully!");
        clearCart();
      }
    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = error.response?.data?.message || "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hide file upload for cash on delivery
  const showFileUpload = selectedPaymentMethod && selectedPaymentMethod !== 'cash';

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
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '80vh', mt: 15 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ mb: 4, color: 'white' }}
      >
        Checkout
      </Typography>
      
      <form onSubmit={handleSubmit}>
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
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="street"
                    label="Street Address"
                    value={deliveryAddress.street}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name, Street Address"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
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
                    name="city"
                    label="City"
                    value={deliveryAddress.city}
                    onChange={handleInputChange}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
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
                    name="province"
                    label="Province"
                    value={deliveryAddress.province}
                    onChange={handleInputChange}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
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
                    name="postalCode"
                    label="Postal Code"
                    value={deliveryAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="5 digits"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
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
                    name="phoneNo"
                    label="Phone Number"
                    value={deliveryAddress.phoneNo}
                    onChange={handleInputChange}
                    placeholder="11 digits"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
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
                value={selectedPaymentMethod}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="jazzCash"
                  control={<Radio />}
                  label="Jazz Cash"
                />
                <FormControlLabel
                  value="easyPaisa"
                  control={<Radio />}
                  label="Easy Paisa"
                />
                <FormControlLabel
                  value="bankTransfer"
                  control={<Radio />}
                  label="Bank Transfer"
                />
              </RadioGroup>

              {/* Payment Details Section */}
              {selectedPaymentMethod !== 'cash' && (
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: 'white',
                      mb: 2,
                      fontWeight: 500
                    }}
                  >
                    Payment Details
                  </Typography>
                  
                  <Card sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    mb: 3
                  }}>
                    <CardContent>
                      {selectedPaymentMethod === 'jazzCash' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Jazz Cash Number:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ color: 'white', mr: 1 }}>
                                03001234567
                              </Typography>
                              <IconButton 
                                size="small"
                                onClick={() => copyToClipboard('03001234567')}
                                sx={{ color: '#149ddd' }}
                              >
                                <FaCopy />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Account Title: SA Graphics
                          </Typography>
                        </>
                      )}

                      {selectedPaymentMethod === 'easyPaisa' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Easy Paisa Number:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ color: 'white', mr: 1 }}>
                                03111234567
                              </Typography>
                              <IconButton 
                                size="small"
                                onClick={() => copyToClipboard('03111234567')}
                                sx={{ color: '#149ddd' }}
                              >
                                <FaCopy />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Account Title: SA Graphics
                          </Typography>
                        </>
                      )}

                      {selectedPaymentMethod === 'bankTransfer' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Account Number:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ color: 'white', mr: 1 }}>
                                1234567890123
                              </Typography>
                              <IconButton 
                                size="small"
                                onClick={() => copyToClipboard('1234567890123')}
                                sx={{ color: '#149ddd' }}
                              >
                                <FaCopy />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Account Title: SA Graphics
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Bank: HBL
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Branch: Main Branch
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* File upload section */}
                  {showFileUpload && (
                      <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                              Upload Payment Proof
                          </Typography>
                          <input
                              accept="image/*"
                              type="file"
                              id="transfer-proof"
                              name="transferProof"
                              onChange={handleInputChange}
                              style={{ display: 'none' }}
                          />
                          <label htmlFor="transfer-proof">
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
                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography sx={{ color: 'white' }}>
                                      {transferProof.name}
                                  </Typography>
                                  <IconButton
                                      onClick={() => setTransferProof(null)}
                                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                  >
                                      <DeleteOutline />
                                  </IconButton>
                              </Box>
                          )}
                      </Box>
                  )}
                </Box>
              )}
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
                    key={item.id || item._id} 
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
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  backgroundColor: '#149ddd',
                  '&:hover': { backgroundColor: '#1187c1' },
                  height: 48
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
      </form>
    </Container>
  );
};

export default Checkout; 