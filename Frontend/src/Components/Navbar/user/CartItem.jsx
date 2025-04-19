import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

// Base64 encoded SVG placeholder (60x80 book placeholder)
const BOOK_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA4MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjVmNWY1Ii8+PHBhdGggZD0iTTE1IDI1aDMwdjEwSDE1eiIgZmlsbD0iI2NjYyIvPjxwYXRoIGQ9Ik0xNSA0MGgzMHYxMEgxNXoiIGZpbGw9IiNjY2MiLz48cGF0aCBkPSJNMTUgNTVoMzB2MTBIMTV6IiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iMzAiIHk9IjE1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiPkJvb2s8L3RleHQ+PC9zdmc+';

const CartItem = React.memo(({ item, updateQuantity, removeFromCart }) => {
  // Memoize the image source to prevent unnecessary re-renders
  const imageSource = useMemo(() => {
    // If coverImage exists and is a valid URL, use it
    if (item.coverImage && (item.coverImage.startsWith('http') || item.coverImage.startsWith('/'))) {
      return item.coverImage;
    }
    return BOOK_PLACEHOLDER;
  }, [item.coverImage]);

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = BOOK_PLACEHOLDER;
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemoveItem = () => {
    removeFromCart(item._id);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        mb: 2,
        backgroundColor: '#1e242c',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }
      }}
    >
      {/* Image with optimized loading and error handling */}
      <Box
        component="img"
        src={imageSource}
        alt={item.title}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
        sx={{
          width: 60,
          height: 80,
          objectFit: 'cover',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}
      />
      
      {/* Item details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="subtitle2" 
          noWrap
          sx={{ 
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 500,
            mb: 0.5
          }}
        >
          {item.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 1
          }}
        >
          Rs. {item.discount > 0 ? item.discountedPrice : item.price}
          {item.discount > 0 && (
            <Typography 
              component="span" 
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'line-through',
                ml: 1
              }}
            >
              Rs. {item.price}
            </Typography>
          )}
        </Typography>
        
        {/* Quantity controls */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          p: 0.5,
          width: 'fit-content'
        }}>
          <IconButton 
            size="small" 
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              p: 0.5,
              '&:hover': {
                color: '#149ddd',
                backgroundColor: 'rgba(20, 157, 221, 0.08)'
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </IconButton>
          
          <Typography 
            variant="body2"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              minWidth: '24px',
              textAlign: 'center'
            }}
          >
            {item.quantity}
          </Typography>
          
          <IconButton 
            size="small" 
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= (item.maxQuantity || 10)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              p: 0.5,
              '&:hover': {
                color: '#149ddd',
                backgroundColor: 'rgba(20, 157, 221, 0.08)'
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
            aria-label="Increase quantity"
          >
            <FiPlus size={16} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Remove item button */}
      <IconButton 
        onClick={handleRemoveItem}
        sx={{ 
          color: 'rgba(255, 255, 255, 0.5)',
          flexShrink: 0,
          '&:hover': {
            color: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.08)'
          }
        }}
        aria-label="Remove item"
      >
        <FiTrash2 size={18} />
      </IconButton>
    </Paper>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.item._id === nextProps.item._id &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.coverImage === nextProps.item.coverImage &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.discountedPrice === nextProps.item.discountedPrice &&
    prevProps.item.discount === nextProps.item.discount &&
    prevProps.item.maxQuantity === nextProps.item.maxQuantity &&
    prevProps.updateQuantity === nextProps.updateQuantity &&
    prevProps.removeFromCart === nextProps.removeFromCart
  );
});

CartItem.displayName = 'CartItem'; // For better debugging in React DevTools

export default CartItem;