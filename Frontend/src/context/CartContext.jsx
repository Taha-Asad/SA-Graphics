import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;
      if (!userId) return [];

      // Get cart data specific to this user
      const savedCart = localStorage.getItem(`cart_${userId}`);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const userId = JSON.parse(userData)._id;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000/${imageUrl.replace(/^\//, '')}`;
  };

  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (item.countInStock && newQuantity > item.countInStock) {
          toast.warning(`Sorry, only ${item.countInStock} copies available`);
          return prevItems;
        }
        
        toast.success('Cart updated successfully!');
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }

      toast.success('Item added to cart!');
      const cartItem = {
        _id: item._id,
        title: item.title,
        price: item.price,
        discount: item.discount || 0,
        discountedPrice: item.discount > 0 ? item.price - (item.price * item.discount / 100) : item.price,
        coverImage: item.coverImage ? formatImageUrl(item.coverImage) : null,
        thumbnail: item.thumbnail ? formatImageUrl(item.thumbnail) : null,
        quantity: 1,
        maxQuantity: item.countInStock,
        type: item.type || 'product'  // Preserve the type field, default to 'product'
      };
      return [...prevItems, cartItem];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    toast.success('Item removed from cart!');

    // Also remove from localStorage if cart becomes empty
    const userData = localStorage.getItem('user');
    if (userData) {
      const userId = JSON.parse(userData)._id;
      if (cartItems.length <= 1) { // If this was the last item
        localStorage.removeItem(`cart_${userId}`);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // Remove cart data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const userId = JSON.parse(userData)._id;
      localStorage.removeItem(`cart_${userId}`);
    }
    toast.success('Cart cleared!');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 
        ? item.price - (item.price * item.discount / 100) 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemTotal = (item) => {
    const itemPrice = item.discount > 0 
      ? item.price - (item.price * item.discount / 100) 
      : item.price;
    return itemPrice * item.quantity;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 