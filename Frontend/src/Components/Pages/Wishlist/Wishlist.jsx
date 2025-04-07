import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Rating
} from '@mui/material';
import { AuthContext } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { BiArrowBack } from 'react-icons/bi';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const Wishlist = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(response.data.data.items);
    } catch (error) {
      toast.error('Failed to fetch wishlist' , error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/wishlist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(items => items.filter(item => item.book._id !== bookId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist' , error);
    }
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4}}>
      <Button
        startIcon={<BiArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontFamily: 'Raleway',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 8
          }}
        >
          <FiHeart size={64} style={{ color: '#9e9e9e', marginBottom: '16px' }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/#portfolio')}
            sx={{ mt: 2 }}
          >
            Browse Books
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.book._id}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={item.book.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={item.book.title}
                />
                <IconButton
                  onClick={() => handleRemoveFromWishlist(item.book._id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)'
                    }
                  }}
                >
                  <FiHeart color="red" />
                </IconButton>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontFamily: 'Raleway',
                      fontSize: '1.1rem',
                      height: '2.4em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {item.book.title}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="textSecondary"
                    gutterBottom
                  >
                    by {item.book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={item.book.averageRating || 0} 
                      readOnly 
                      size="small"
                      precision={0.5}
                    />
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ ml: 1 }}
                    >
                      ({item.book.reviewCount || 0})
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {item.book.discount > 0 ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                          Rs. {item.book.price}
                        </span>
                        Rs. {item.book.price - (item.book.price * item.book.discount / 100)}
                        <span style={{ color: 'red', marginLeft: '8px' }}>
                          ({item.book.discount}% off)
                        </span>
                      </>
                    ) : (
                      `Rs. ${item.book.price}`
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<FiShoppingCart />}
                    onClick={() => handleAddToCart(item.book)}
                    disabled={item.book.countInStock === 0}
                  >
                    {item.book.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 