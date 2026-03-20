import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import Button from "../../components/common/Button";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    loading,
    updateCartItem,
    removeCartItem,
    clearCart,
    loadCart,
  } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, quantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    await removeCartItem(cartItemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    // TODO: Navigate to checkout page when implemented
    alert("Checkout functionality coming soon!");
  };

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={loading}
        >
          Clear Cart
        </Button>
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
