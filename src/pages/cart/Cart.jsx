import React, { useEffect, useState } from "react";
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
    syncCartPrices,
  } = useCart();

  const [syncing, setSyncing] = useState(false);

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

  // Check if any items have price changes
  const hasPriceChanges = cart?.items?.some(item => item.priceChanged) || false;

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    const result = await updateCartItem(cartItemId, quantity);
    return result; // Return result so CartItem can handle errors
  };

  const handleRemoveItem = async (cartItemId) => {
    const result = await removeCartItem(cartItemId);
    return result; // Return result so CartItem can handle errors
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

  const handleSyncPrices = async () => {
    setSyncing(true);
    const result = await syncCartPrices();
    setSyncing(false);

    if (result.success) {
      alert("Cart prices have been updated to current prices!");
    } else {
      alert(result.error || "Failed to sync prices");
    }
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

      {/* Price Change Alert */}
      {hasPriceChanges && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 mt-0.5">
              info
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                Price Changes Detected
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Some items in your cart have different prices than when you added them.
                The current prices are shown below.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSyncPrices}
                disabled={syncing}
              >
                {syncing ? "Updating..." : "Update to Current Prices"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
