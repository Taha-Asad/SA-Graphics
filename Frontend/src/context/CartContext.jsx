import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > book.countInStock) {
          toast.warning(`Sorry, only ${book.countInStock} copies available`);
          return prevItems;
        }
        
        toast.success('Cart updated successfully!');
        return prevItems.map(item =>
          item.id === book._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      toast.success('Item added to cart!');
      const cartItem = {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        discount: book.discount || 0,
        discountedPrice: book.discount > 0 ? book.price - (book.price * book.discount / 100) : book.price,
        coverImage: book.coverImage,
        quantity: 1
      };
      return [...prevItems, cartItem];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.success('Item removed from cart!');
  };

  const clearCart = () => {
    setCartItems([]);
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