import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import BulkMembershipSavingsBar from "../../components/membership/BulkMembershipSavingsBar";
import ProductReviewsSection from "../../components/products/ProductReviewsSection";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(id);
        const data = response.data?.data || response.data;
        setProduct(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    if (price == null) return "LKR 0.00";
    return `LKR ${Number(price).toFixed(2)}`;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check stock availability
    if (!product.stock || product.stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);

    if (result.success) {
      console.log("Added to cart successfully");
    } else {
      console.error("Failed to add to cart:", result.error);
      alert(result.error || "Failed to add item to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setBuyingNow(true);
    const result = await addToCart(product.id, quantity);
    setBuyingNow(false);

    if (result.success) {
      navigate("/checkout");
    } else {
      alert(result.error || "Failed to add item to cart");
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    const maxStock = product?.stock || 0;

    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
            <span className="material-symbols-outlined text-4xl text-red-500">
              error
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {error}
          </p>
          <Link
            to="/products"
            className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  if (!product) return null;

  const hasDiscount =
    product.salePrice && product.salePrice < product.basePrice;
  const images = product.images || [];
  const currentImage = images[selectedImage] || null;

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/"
          className="transition-colors hover:text-primary dark:hover:text-white"
        >
          Home
        </Link>
        <span className="material-symbols-outlined text-xs">
          chevron_right
        </span>
        <Link
          to="/products"
          className="transition-colors hover:text-primary dark:hover:text-white"
        >
          Products
        </Link>
        <span className="material-symbols-outlined text-xs">
          chevron_right
        </span>
        <span className="text-slate-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            {currentImage ? (
              <img
                src={currentImage.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-slate-300 dark:text-slate-600">
                  image
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${i === selectedImage
                    ? "border-primary"
                    : "border-transparent hover:border-slate-300"
                    }`}
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Brand & Category */}
          <div className="mb-2 flex items-center gap-3">
            {product.brand && (
              <span className="text-sm font-medium text-primary dark:text-accent-gold">
                {product.brand.name}
              </span>
            )}
            {product.brand && product.category && (
              <span className="text-slate-300 dark:text-slate-600">|</span>
            )}
            {product.category && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {product.name}
          </h1>

          {/* SKU */}
          <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>

          {/* Stock Status */}
          <div className="mt-2 flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                {product.stock <= (product.lowStockThreshold || 10) ? (
                  <span className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    In Stock ({product.stock} available)
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <span className="material-symbols-outlined text-sm">cancel</span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary dark:text-white">
              {formatPrice(
                hasDiscount ? product.salePrice : product.basePrice
              )}
            </span>
            {hasDiscount && (
              <span className="text-xl text-slate-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-lg bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30">
                {Math.round(
                  ((product.basePrice - product.salePrice) /
                    product.basePrice) *
                  100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-400">
              {product.description}
            </p>
          )}

          {/* Details (Weight, Dimensions) */}
          {(product.weight || product.dimensions) && (
            <div className="mt-6 flex flex-wrap gap-4">
              {product.weight && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    scale
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {product.weight} kg
                  </span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    straighten
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {product.dimensions}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <BulkMembershipSavingsBar product={product} quantity={quantity} />

          {/* Quantity & Add to Cart */}
          <div className="mt-8 space-y-4">
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quantity:
                </span>
                <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-6 py-2 text-base font-medium text-slate-900 dark:text-white min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Max: {product.stock}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || buyingNow || !product.stock || product.stock <= 0}
                className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl border-2 border-primary bg-white px-6 text-base font-bold text-primary transition-transform active:scale-95 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    Adding...
                  </>
                ) : product.stock <= 0 ? (
                  <>
                    <span className="material-symbols-outlined">block</span>
                    Out of Stock
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={buyingNow || addingToCart || !product.stock || product.stock <= 0}
                className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-accent-gold px-6 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">bolt</span>
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Specifications
              </h3>
              <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.key}
                    className="flex px-4 py-3"
                  >
                    <dt className="w-40 shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {spec.key}
                    </dt>
                    <dd className="text-sm text-slate-900 dark:text-white">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <ProductReviewsSection productId={product.id} isAuthenticated={isAuthenticated} />
    </section>
  );
};

export default ProductDetailPage;
