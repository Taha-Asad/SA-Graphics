import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  CircularProgress,
  Divider,
  Grid,
  ButtonGroup
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/v1';
const PLACEHOLDER_IMAGE = 'https://placehold.co/60x80/e0e0e0/949494.png?text=No+Image';

const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

const getStepNumber = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
};

const formatAddress = (address) => {
  if (!address) return 'No delivery address provided';
  
  const parts = [];
  
  // Street address
  parts.push(address.street || 'Street address not provided');
  
  // City
  if (address.city && address.city !== 'Not specified') {
    parts.push(address.city);
  } else {
    parts.push('City not provided');
  }
  
  // Province
  if (address.province && address.province !== 'Not specified') {
    parts.push(address.province);
  } else {
    parts.push('Province not provided');
  }
  
  // Postal Code
  if (address.postalCode && address.postalCode !== 'Not specified') {
    parts.push(address.postalCode);
  } else {
    parts.push('Postal code not provided');
  }

  return parts.join(', ');
};

const getImageUrl = (item) => {
  console.log('Processing item:', item); // Debug log for item data

  if (!item) return PLACEHOLDER_IMAGE;

  // For service items (like Graphic Designing)
  if (item.service) {
    console.log('Service item detected:', item.service);
    return PLACEHOLDER_IMAGE;
  }

  // If we have a populated bookId with image
  if (item.bookId?.image) {
    const url = item.bookId.image.startsWith('http') 
      ? item.bookId.image 
      : `/uploads/${item.bookId.image}`; // Remove API_URL for relative path
    console.log('Book image URL:', url);
    return url;
  }
  
  // If we have a direct image
  if (item.image) {
    const url = item.image.startsWith('http') 
      ? item.image 
      : `/uploads/${item.image}`; // Remove API_URL for relative path
    console.log('Direct image URL:', url);
    return url;
  }
  
  console.log('No image found, using placeholder');
  return PLACEHOLDER_IMAGE;
};

const OrderItem = React.memo(({ item }) => {
  const [imgSrc, setImgSrc] = useState(() => getImageUrl(item));
  const [imgError, setImgError] = useState(false);
  
  const title = useMemo(() => {
    if (item.service) return item.service;
    return item.title || (item.bookId?.title) || 'Book';
  }, [item]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src); // Debug log for failed images
    if (!imgError) {
      setImgError(true);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  useEffect(() => {
    if (item) {
      setImgError(false);
      const url = getImageUrl(item);
      console.log('Setting image URL:', url); // Debug log for URL updates
      setImgSrc(url);
    }
  }, [item]);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: 1
      }}
    >
      {!item.service ? (
        <Box
          component="img"
          src={imgSrc}
          alt={title}
          loading="lazy"
          sx={{
            width: 60,
            height: 80,
            objectFit: 'cover',
            borderRadius: 1,
            mr: 2,
            bgcolor: 'grey.200'
          }}
          onError={handleImageError}
        />
      ) : (
        <Box
          sx={{
            width: 60,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            mr: 2,
            bgcolor: 'grey.200',
            color: 'grey.500',
            fontSize: '0.75rem',
            textAlign: 'center',
            p: 1
          }}
        >
          Service
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quantity: {item.quantity} × Rs. {item.price}
        </Typography>
      </Box>
      <Typography variant="subtitle1">
        Rs. {item.quantity * item.price}
      </Typography>
    </Box>
  );
});

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.status === 'success') {
          setOrder(response.data.data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to fetch order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleBack = () => {
    navigate('/orders');
  };

  if (loading) {
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

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Order not found
        </Typography>
        <Button
          startIcon={<BiArrowBack />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ButtonGroup sx={{ mb: 3 }}>
        <Button
          startIcon={<BiArrowBack />}
          onClick={handleBack}
          sx={{
            mr: 1,
            borderColor: '#149ddd',
            color: '#149ddd',
            '&:hover': {
              borderColor: '#1187c1',
              backgroundColor: 'rgba(20, 157, 221, 0.04)'
            }
          }}
        >
          Back to Orders
        </Button>
        <Button
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
      </ButtonGroup>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Track Order #{orderId.slice(-8)}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Stepper activeStep={getStepNumber(order.status)} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {order.item.map((item) => (
                <OrderItem key={item._id || item.bookId} item={item} />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Order Date:</Typography>
                  <Typography variant="body2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Status:</Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: order.status === 'delivered' ? 'success.main' : 'primary.main',
                      fontWeight: 600
                    }}
                  >
                    {order.status}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Items:</Typography>
                  <Typography variant="body2">
                    {order.item.reduce((acc, item) => acc + item.quantity, 0)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Rs. {order.totalAmount}
                  </Typography>
                </Box>
              </Box>

              {order.shippingAddress && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Delivery Address:
                  </Typography>
                  <Typography variant="body2">
                    {formatAddress(order.shippingAddress)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TrackOrder; 