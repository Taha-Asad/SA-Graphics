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
const COURSE_PLACEHOLDER = 'https://placehold.co/60x80/e0e0e0/949494.png?text=Course';

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
  if (!item) return PLACEHOLDER_IMAGE;

  // For service items (like Graphic Designing)
  if (item.service) {
    return COURSE_PLACEHOLDER;
  }

  // For course items
  if (item.courseId) {
    if (!item.courseId.thumbnail) {
      return COURSE_PLACEHOLDER;
    }
    // Handle absolute URLs
    if (item.courseId.thumbnail.startsWith('http')) {
      return item.courseId.thumbnail;
    }
    // Handle relative paths
    const cleanPath = item.courseId.thumbnail.startsWith('/')
      ? item.courseId.thumbnail.substring(1)
      : item.courseId.thumbnail;
    return `${API_URL}/${cleanPath}`;
  }

  // If we have a populated bookId with image
  if (item.bookId?.coverImage) {
    if (item.bookId.coverImage.startsWith('http')) {
      return item.bookId.coverImage;
    }
    const cleanPath = item.bookId.coverImage.startsWith('/')
      ? item.bookId.coverImage.substring(1)
      : item.bookId.coverImage;
    return `${API_URL}/${cleanPath}`;
  }
  
  // If we have a direct image
  if (item.image) {
    if (item.image.startsWith('http')) {
      return item.image;
    }
    const cleanPath = item.image.startsWith('/')
      ? item.image.substring(1)
      : item.image;
    return `${API_URL}/${cleanPath}`;
  }
  
  // Return appropriate placeholder based on item type
  return item.courseId ? COURSE_PLACEHOLDER : PLACEHOLDER_IMAGE;
};

const getItemPrice = (item) => {
  if (item.service) return item.price;
  
  // If we have a populated bookId with discount
  if (item.bookId?.discount > 0) {
    const discountedPrice = item.bookId.price - (item.bookId.price * item.bookId.discount / 100);
    return discountedPrice;
  }
  
  // If we have a direct discount
  if (item.discount > 0) {
    const discountedPrice = item.price - (item.price * item.discount / 100);
    return discountedPrice;
  }
  
  // If we have a direct discountedPrice
  if (item.discountedPrice) {
    return item.discountedPrice;
  }
  
  // Default to regular price
  return item.price;
};

const getItemDisplayPrice = (item) => {
  if (item.service) return `Rs. ${item.price}`;
  
  // If we have a populated bookId with discount
  if (item.bookId?.discount > 0) {
    return (
      <>
        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
          Rs. {item.bookId.price}
        </span>
        Rs. {item.bookId.price - (item.bookId.price * item.bookId.discount / 100)}
        <span style={{ color: 'red', marginLeft: '8px' }}>
          ({item.bookId.discount}% off)
        </span>
      </>
    );
  }
  
  // If we have a direct discount
  if (item.discount > 0) {
    return (
      <>
        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
          Rs. {item.price}
        </span>
        Rs. {item.price - (item.price * item.discount / 100)}
        <span style={{ color: 'red', marginLeft: '8px' }}>
          ({item.discount}% off)
        </span>
      </>
    );
  }
  
  // Default to regular price
  return `Rs. ${item.price}`;
};

const OrderItem = React.memo(({ item }) => {
  const [imgSrc, setImgSrc] = useState(() => getImageUrl(item));
  const [imgError, setImgError] = useState(false);
  
  const title = useMemo(() => {
    if (item.service) return item.service;
    if (item.courseId) return item.courseId.title || 'Course';
    return item.title || (item.bookId?.title) || 'Book';
  }, [item]);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      // Use course placeholder for course items, general placeholder for others
      setImgSrc(item.courseId ? COURSE_PLACEHOLDER : PLACEHOLDER_IMAGE);
    }
  };

  useEffect(() => {
    if (item) {
      setImgError(false);
      const url = getImageUrl(item);
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
          onError={handleImageError}
          sx={{
            width: 60,
            height: 80,
            objectFit: 'cover',
            borderRadius: 1,
            mr: 2,
            bgcolor: 'grey.200'
          }}
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
          Quantity: {item.quantity} × {getItemDisplayPrice(item)}
        </Typography>
      </Box>
      <Typography variant="subtitle1">
        Rs. {getItemPrice(item) * item.quantity}
      </Typography>
    </Box>
  );
});

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastStatus, setLastStatus] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        const newOrder = response.data.data.order;
        if (lastStatus && lastStatus !== newOrder.status) {
          toast.info(`Order status updated to: ${newOrder.status.toUpperCase()}`);
        }
        setLastStatus(newOrder.status);
        setOrder(newOrder);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Polling for updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
        fetchOrder();
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [order, orderId]);

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
              {order.items.map((item) => (
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
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
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