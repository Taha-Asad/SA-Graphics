import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
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
      <Box
        component="img"
        src={item.image}
        alt={item.title}
        sx={{
          width: 60,
          height: 80,
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />
      
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="subtitle2" 
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
          Rs. {item.price}
        </Typography>
        
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
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
          >
            <FiPlus size={16} />
          </IconButton>
        </Box>
      </Box>
      
      <IconButton 
        onClick={() => removeFromCart(item.id)}
        sx={{ 
          color: 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            color: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.08)'
          }
        }}
      >
        <FiTrash2 size={18} />
      </IconButton>
    </Paper>
  );
};

export default CartItem; 