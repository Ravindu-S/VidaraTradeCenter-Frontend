import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price) => {
    if (price == null) return "$0.00";
    return `$${Number(price).toFixed(2)}`;
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    setIsUpdating(true);
    await onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.id);
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {formatPrice(item.price)} each
          </p>
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
              disabled={isUpdating}
              className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          {formatPrice(item.subtotal)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
