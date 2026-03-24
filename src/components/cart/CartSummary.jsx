import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";

const CartSummary = ({ cart, onCheckout }) => {
  const formatPrice = (price) => {
    if (price == null) return "LKR 0.00";
    return `LKR ${Number(price).toFixed(2)}`;
  };

  const subtotal = cart?.totalAmount || 0;
  const shipping = subtotal > 0 ? 10.0 : 0; // Example shipping cost
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + shipping + tax;

  return (
    <Card className="sticky top-24">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Subtotal ({cart?.totalItems || 0} items)
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Shipping</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {subtotal > 0 ? formatPrice(shipping) : "-"}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Estimated Tax
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatPrice(tax)}
          </span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">
              Total
            </span>
            <span className="font-bold text-xl text-primary dark:text-white">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={onCheckout}
        disabled={!cart?.items?.length}
      >
        Proceed to Checkout
      </Button>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-sm text-primary">
            local_shipping
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Free shipping on orders over LKR 5000
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartSummary;
