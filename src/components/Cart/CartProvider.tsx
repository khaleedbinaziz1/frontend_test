'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveCart, getCart, clearCart } from './cartService';
import {
  CartItem,
  CartContextType,
  CartStateContextType,
  CartDetailsContextType
} from './types';
import { trackEvent } from '../analytics/tracking';

const CartContext = createContext<CartContextType | null>(null);
const CartStateContext = createContext<CartStateContextType | null>(null);
const CartDetailsContext = createContext<CartDetailsContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartState = () => {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
};

export const useCartDetails = () => {
  const context = useContext(CartDetailsContext);
  if (!context) {
    throw new Error('useCartDetails must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartDetails, setCartDetails] = useState<CartDetailsContextType['cartDetails']>({
    items: [],
    total: 0,
  });

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const savedCart = await getCart();
        if (savedCart && Array.isArray(savedCart.items)) {
          setCartItems(savedCart.items);
          setCartDetails(savedCart);
        } else {
          setCartItems([]);
          setCartDetails({ items: [], total: 0 });
        }
      } catch (err) {
        setError('Failed to load cart');
        console.error('Error loading cart:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart state and persist
  const saveCartState = async (items: CartItem[]) => {
    try {
      const total = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
      const details = { items, total };
      setCartItems(items);
      setCartDetails(details);
      await saveCart(details);  // <-- save full cart object
    } catch (err) {
      console.error('Failed to save cart:', err);
      setError('Failed to save cart');
    }
  };

  const addToCart = async (
    product: Omit<CartItem, 'cartId' | 'quantity'> & { _id: string },
    quantity: number
  ) => {
    try {
      setError(null);
      const existingIndex = cartItems.findIndex(item => item.cartId === product._id);
      let updatedItems: CartItem[];

      if (existingIndex !== -1) {
        updatedItems = [...cartItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
      } else {
        const newItem: CartItem = {
          ...product,
          cartId: product._id,
          quantity,
        };
        updatedItems = [...cartItems, newItem];
      }

      await saveCartState(updatedItems);
      // Track add_to_cart event
      trackEvent({ event: 'add_to_cart', productId: product._id });
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const buyNow = async (
    product: Omit<CartItem, 'cartId' | 'quantity'> & { _id: string },
    quantity: number
  ) => {
    try {
      setError(null);

      const newItem: CartItem = {
        ...product,
        cartId: product._id,
        quantity,
      };

      const updatedItems: CartItem[] = [newItem];
      const total = newItem.salePrice * quantity;

      // Save to local state and backend
      await saveCartState(updatedItems);

      // Optional: clear other cart data from previous session
      await clearCart();

      // Save to localStorage for checkout page
      localStorage.setItem('cartDetails', JSON.stringify({
        items: updatedItems,
        total: total.toFixed(0),
      }));

      // Redirect to checkout
      window.location.href = '/pages/checkout';
    } catch (err) {
      setError('Failed to process Buy Now');
      console.error('Error in buyNow:', err);
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      setError(null);
      const updatedItems = cartItems.filter(item => item.cartId !== cartId);
      await saveCartState(updatedItems);
      // Track remove_from_cart event
      trackEvent({ event: 'remove_from_cart', productId: cartId });
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const updateItemQuantity = async (cartId: string, type: 'increase' | 'decrease') => {
    try {
      setError(null);
      let updatedItems = cartItems
        .map(item => {
          if (item.cartId === cartId) {
            const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
            if (newQty < 1) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      await saveCartState(updatedItems);
    } catch (err) {
      setError('Failed to update item quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const saveCartDetails = (details: CartDetailsContextType['cartDetails']) => {
    setCartDetails(details);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        buyNow,
        removeFromCart,
        updateItemQuantity,
        totalPrice: cartDetails.total,
        isLoading,
        error,
      }}
    >
      <CartStateContext.Provider
        value={{
          isCartOpen,
          toggleCart,
          itemCount: cartItems.length,
        }}
      >
        <CartDetailsContext.Provider
          value={{
            cartDetails,
            saveCartDetails,
          }}
        >
          {children}
        </CartDetailsContext.Provider>
      </CartStateContext.Provider>
    </CartContext.Provider>
  );
};
