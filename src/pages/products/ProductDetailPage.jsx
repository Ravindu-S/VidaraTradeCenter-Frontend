import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import Loader from "../../components/common/Loader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

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
    if (price == null) return "$0.00";
    return `$${Number(price).toFixed(2)}`;
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
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === selectedImage
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

          {/* Add to Cart */}
          <button className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg">
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </button>

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
    </section>
  );
};

export default ProductDetailPage;
