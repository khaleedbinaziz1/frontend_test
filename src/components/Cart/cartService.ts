'use client';

import { CartItem } from './types';

const CART_STORAGE_KEY = 'cart';

export interface CartDetails {
  items: CartItem[];
  total: number;
}

export const saveCart = async (cartDetails: CartDetails): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartDetails));
    }
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

export const getCart = async (): Promise<CartDetails | null> => {
  try {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
