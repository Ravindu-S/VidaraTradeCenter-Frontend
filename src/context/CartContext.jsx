import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();
      setCart(response.data?.data || response.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.addToCart(productId, quantity);
      setCart(response.data?.data || response.data);
      return { success: true };
    } catch (err) {
      console.error("Failed to add to cart:", err);
      const errorMessage = err.response?.data?.message || "Failed to add item to cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.updateCartItem(cartItemId, quantity);
      setCart(response.data?.data || response.data);
      return { success: true };
    } catch (err) {
      console.error("Failed to update cart item:", err);
      const errorMessage = err.response?.data?.message || "Failed to update cart item";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.removeCartItem(cartItemId);
      setCart(response.data?.data || response.data);
      return { success: true };
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      const errorMessage = err.response?.data?.message || "Failed to remove item from cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartApi.clearCart();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      return { success: true };
    } catch (err) {
      console.error("Failed to clear cart:", err);
      const errorMessage = err.response?.data?.message || "Failed to clear cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const syncCartPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.syncCartPrices();
      setCart(response.data?.data || response.data);
      return { success: true };
    } catch (err) {
      console.error("Failed to sync cart prices:", err);
      const errorMessage = err.response?.data?.message || "Failed to sync cart prices";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const cartItemCount = cart?.totalItems || 0;
  const cartTotal = cart?.totalAmount || 0;

  const value = {
    cart,
    loading,
    error,
    cartItemCount,
    cartTotal,
    loadCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    syncCartPrices,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
