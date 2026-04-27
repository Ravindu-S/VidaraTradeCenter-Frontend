import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useToast } from "../../context/ToastContext";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showError, showSuccess } = useToast();

  const formatPrice = (price) => {
    if (price == null) return "LKR 0.00";
    return `LKR ${Number(price).toFixed(2)}`;
  };

  const hasStackedPricing =
    item.effectiveUnitPrice != null &&
    item.effectiveSubtotal != null &&
    (Number(item.bulkDiscountPercent) > 0 || Number(item.membershipDiscountPercent) > 0);

  // Get available stock from item
  const availableStock = item.stock !== undefined && item.stock !== null ? item.stock : null;
  const hasStockData = availableStock !== null;
  const isAtMaxStock = hasStockData && quantity >= availableStock;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    // Client-side validation: Check if exceeding stock
    if (hasStockData && newQuantity > availableStock) {
      showError(`Only ${availableStock} items available in stock`);
      return;
    }

    setQuantity(newQuantity);
    setIsUpdating(true);
    const result = await onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);

    // Handle API errors
    if (result && !result.success) {
      // Revert quantity on error
      setQuantity(item.quantity);
      showError(result.error || "Failed to update quantity");
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    const result = await onRemove(item.id);
    if (result && !result.success) {
      setIsUpdating(false);
      showError(result.error || "Failed to remove item");
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Product Image */}
      <Link
        to={`/products/${item.productId}`}
        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        {item.productImage ? (
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
              image
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${item.productId}`}
            className="font-semibold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
          >
            {item.productName}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {hasStackedPricing ? (
                <>
                  <span className="line-through opacity-70">{formatPrice(item.price)}</span>
                  <span className="font-semibold text-primary">{formatPrice(item.effectiveUnitPrice)}</span>
                  <span>each</span>
                </>
              ) : (
                <>{formatPrice(item.price)} each</>
              )}
            </p>
            {item.priceChanged && item.priceAtAddition && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-orange-600 dark:text-orange-400 line-through">
                  {formatPrice(item.priceAtAddition)}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium">
                  Price changed
                </span>
              </div>
            )}
          </div>

          {/* Stock Availability */}
          {hasStockData && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {availableStock > 0 ? (
                <span className={availableStock <= 10 ? "text-orange-600 dark:text-orange-400 font-medium" : ""}>
                  {availableStock} available
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Out of stock
                </span>
              )}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="px-4 py-1 text-sm font-medium text-slate-900 dark:text-white min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating || isAtMaxStock}
              className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isAtMaxStock ? `Maximum ${availableStock} available` : "Increase quantity"}
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex-shrink-0 text-right">
        <p className="font-bold text-lg text-slate-900 dark:text-white">
          {formatPrice(hasStackedPricing ? item.effectiveSubtotal : item.subtotal)}
        </p>
        {hasStackedPricing && (
          <p className="text-xs text-slate-400 line-through">{formatPrice(item.subtotal)}</p>
        )}
      </div>
    </div>
  );
};

export default CartItem;
