import React from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
          shopping_cart
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Your cart is empty
      </h2>

      <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
      </p>

      <Link to="/products">
        <Button variant="primary">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
