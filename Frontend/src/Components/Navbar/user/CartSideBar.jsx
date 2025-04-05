import { 
  Box, 
  Button, 
  Divider, 
  Typography, 
  IconButton,
  Paper,
  Badge,
  Slide
} from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsCart3 } from 'react-icons/bs'
import { FiShoppingBag, FiHome } from 'react-icons/fi'
import CartItem from './CartItem'
import { useCart } from '../../../context/CartContext'
import { MdClose } from 'react-icons/md'

const CartSideBar = ({ onClose, open }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
    if (onClose) onClose();
  };

  const handleContinueShopping = () => {
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <Slide 
      direction="left" 
      in={open} 
      timeout={600}
      mountOnEnter 
      unmountOnExit
    >
      <Box
        sx={{
          width: { xs: "85%", sm: "65%", md: "45%", lg: "25%" },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          backgroundColor: "#0c1117",
          color: "white",
          right: 0,
          top: 0,
          zIndex: 1300,
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1e242c'
        }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'rgba(255, 255, 255, 0.85)',
              '&:hover': {
                color: '#149ddd',
                backgroundColor: 'rgba(20, 157, 221, 0.08)'
              }
            }}
          >
            <MdClose size={24} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Badge 
              badgeContent={cartItems.length} 
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#149ddd',
                  color: 'white'
                }
              }}
            >
              <BsCart3 size={24} />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Shopping Cart ({cartItems.length})
            </Typography>
          </Box>
        </Box>

        {/* Cart Items */}
        <Box 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#0c1117',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.02)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            },
          }}
        >
          {cartItems.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <FiShoppingBag size={48} />
              <Typography variant="body1">
                Your cart is empty
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FiHome />}
                onClick={handleContinueShopping}
                sx={{
                  mt: 2,
                  borderColor: '#149ddd',
                  color: '#149ddd',
                  '&:hover': {
                    borderColor: '#1187c1',
                    backgroundColor: 'rgba(20, 157, 221, 0.08)'
                  }
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </Box>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: '#1e242c',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Subtotal:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Rs. {getCartTotal().toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleContinueShopping}
                sx={{
                  borderColor: '#149ddd',
                  color: '#149ddd',
                  '&:hover': {
                    borderColor: '#1187c1',
                    backgroundColor: 'rgba(20, 157, 221, 0.08)'
                  }
                }}
              >
                Continue Shopping
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#149ddd',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1187c1'
                  }
                }}
              >
                Checkout
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Slide>
  );
};

export default CartSideBar;