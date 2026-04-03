import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    if (price == null) return "LKR 0.00";
    return `LKR ${Number(price).toFixed(2)}`;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check stock availability only if stock data is available
    if (product.stock !== undefined && product.stock !== null && product.stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      console.log("Added to cart successfully");
    } else {
      console.error("Failed to add to cart:", result.error);
      alert(result.error || "Failed to add item to cart");
    }
  };

  const imageUrl = product.primaryImageUrl || null;
  const hasDiscount =
    product.salePrice && product.salePrice < product.basePrice;

  // Handle stock - if stock is undefined/null, assume it's available (backward compatibility)
  const hasStockData = product.stock !== undefined && product.stock !== null;
  const isOutOfStock = hasStockData && product.stock <= 0;
  const isLowStock = hasStockData && product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col gap-4">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url("${imageUrl}")` }}
            role="img"
            aria-label={product.name}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
              image
            </span>
          </div>
        )}

        {/* Priority: Out of Stock > Low Stock > Sale */}
        {isOutOfStock ? (
          <div className="absolute left-4 top-4 rounded-lg bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute left-4 top-4 rounded-lg bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Low Stock
          </div>
        ) : hasDiscount ? (
          <div className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Sale
          </div>
        ) : null}

        {/* Show cart button if not out of stock */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-white text-primary opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">
          {product.name}
        </h3>

        {/* Stock Status Text */}
        {hasStockData && (
          <div className="flex items-center gap-1.5">
            {isOutOfStock ? (
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                In Stock
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {product.categoryName || ""}
          </p>
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
            <span className="font-bold text-primary dark:text-white">
              {formatPrice(
                hasDiscount ? product.salePrice : product.basePrice
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
