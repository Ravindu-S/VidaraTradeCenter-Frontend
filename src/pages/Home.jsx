import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getProducts } from "../api/productApi";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts({ page: 0, size: 4 });
        const data = response.data;

        // Handle ApiResponse<PagedResponse> OR plain PagedResponse OR plain array
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data?.data?.content && Array.isArray(data.data.content)) {
          products = data.data.content; // ApiResponse<PagedResponse> format
        } else if (data?.content && Array.isArray(data.content)) {
          products = data.content; // PagedResponse format
        } else if (data?.products && Array.isArray(data.products)) {
          products = data.products;
        }

        setFeaturedProducts(products.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products:", err);

        // Don't show scary errors if backend just isn't ready
        if (err.code === "ERR_NETWORK" || !err.response) {
          setError("BACKEND_NOT_READY");
        } else if (err.response?.status === 404) {
          setError("ENDPOINT_NOT_FOUND");
        } else {
          setError("UNKNOWN");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price) => {
    if (price == null) return "LKR 0.00";
    return `LKR ${Number(price).toFixed(2)}`;
  };

  const getImageUrl = (product) => {
    return product.primaryImageUrl || product.imageUrl || null;
  };

  const getCategoryName = (product) => {
    if (product.categoryName) return product.categoryName;
    if (!product.category) return "";
    if (typeof product.category === "string") return product.category;
    if (typeof product.category === "object") return product.category.name || "";
    return "";
  };

  const getProductBadge = (product) => {
    if (product.status === "NEW" || product.status === "new") {
      return { text: "New", color: "bg-accent-gold" };
    }
    if (product.stock !== undefined && product.stock <= 5 && product.stock > 0) {
      return { text: `Only ${product.stock} left`, color: "bg-accent-gold" };
    }
    if (product.featured) {
      return { text: "Best Seller", color: "bg-primary" };
    }
    return null;
  };

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="order-2 flex flex-col gap-8 lg:order-1">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-gold bg-accent-gold/10 w-fit rounded-full">
                <span className="material-symbols-outlined text-xs">
                  auto_awesome
                </span>
                New Spring Collection
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Refined Essentials for the{" "}
                <span className="text-accent-gold">Modern</span> Professional.
              </h1>

              <p className="max-w-[540px] text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                We believe your everyday tools should be as functional as they
                are beautiful. Explore our curated selection of high-performance
                workplace gear.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
              >
                Shop the Collection
              </Link>
              <a
                href="#about"
                className="flex h-14 items-center justify-center rounded-xl border-2 border-slate-200 bg-transparent px-8 text-base font-bold text-slate-900 transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
              >
                Our Story
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-[500px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC78lh03NsTHckMZn0CvxjBt6uyg_ptR0_kk8gPfjnFqNiArB7z-xu39HEKIykvulgFigDGDiRpkyvkeTqyjgNjOhRI9tbeRyjXes8khbQW0AKGufjnVEm2JWHDKx0PN0ssw3z83M7f9i3G31U5MMdbMbp4tDIAivEjQ5D8zTzCkuRF78Ut-vI1NazZLxCLr0Fu13aElBNPjB3eF0n3pKwcxYOv9W2Jonl632U6bsKW0hUKt0QA70wZoSmlICk5D5JSzHbJzKQ_xP5T")`,
                }}
                role="img"
                aria-label="Minimalist workspace with clean professional desk accessories"
              />

              <div className="absolute bottom-6 right-6 flex items-center gap-4 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm dark:bg-slate-900/90">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Premium Quality
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Guaranteed durability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="bg-white dark:bg-slate-900/30 py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Featured Selections
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Handpicked items that define our philosophy.
              </p>
            </div>
            {featuredProducts.length > 0 && (
              <Link
                to="/products"
                className="group flex items-center gap-2 text-sm font-bold text-primary dark:text-white"
              >
                View All Products
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            )}
          </div>

          {/*LOADING*/}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          )}

          {/*BACKEND NOT READY*/}
          {!loading && error === "BACKEND_NOT_READY" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 mb-6">
                <span className="material-symbols-outlined text-4xl text-amber-500">
                  engineering
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Store Coming Soon
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                We're setting up our product catalog. Please check back shortly
              </p>
            </div>
          )}

          {/*ENDPOINT NOT FOUND (DEV 3 hasn't built it yet)*/}
          {!loading && error === "ENDPOINT_NOT_FOUND" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-6">
                <span className="material-symbols-outlined text-4xl text-blue-500">
                  construction
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Products API In Progress
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                The product catalog is being built. This section will
                automatically show products once the API is ready.
              </p>
              {/* only visible in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-6 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-4 text-left max-w-lg">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    DEV NOTE:
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    GET /api/products returned 404.
                    <br />
                    DEV 3 needs to implement ProductController.
                  </p>
                </div>
              )}
            </div>
          )}

          {/*UNKNOWN ERROR*/}
          {!loading && error === "UNKNOWN" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
                <span className="material-symbols-outlined text-4xl text-red-500">
                  cloud_off
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Something went wrong
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                We couldn't load products right now. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/*EMPTY STATE (no products in DB)*/}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                <span className="material-symbols-outlined text-4xl text-slate-400">
                  inventory_2
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                No products yet
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Our collection is being curated. Check back soon for premium
                professional essentials.
              </p>
            </div>
          )}

          {/*PRODUCTS GRID (real data from backend)*/}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const badge = getProductBadge(product);
                const imageUrl = getImageUrl(product);

                return (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="group flex flex-col gap-4"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                      {imageUrl ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{
                            backgroundImage: `url("${imageUrl}")`,
                          }}
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

                      {/* Add to Cart */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: DEV 3 â€” Add to cart logic
                          console.log("Add to cart:", product.id);
                        }}
                        className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-white text-primary opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 shadow-lg hover:bg-slate-50"
                      >
                        <span className="material-symbols-outlined">
                          add_shopping_cart
                        </span>
                      </button>

                      {/* Badge */}
                      {badge && (
                        <div
                          className={`absolute left-4 top-4 rounded-lg ${badge.color} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}
                        >
                          {badge.text}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {getCategoryName(product)}
                        </p>
                        <p className="font-bold text-primary dark:text-white">
                          {formatPrice(product.salePrice || product.basePrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ==================== COMMUNITY CTA ==================== */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center lg:py-24">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-gold/10 blur-3xl" />

          <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Join the Vidara Circle
              </h2>
              <p className="text-lg text-slate-300">
                Be the first to know about new collection drops, exclusive
                styling tips, and member-only events.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                className="h-14 min-w-0 sm:min-w-[300px] rounded-xl border-none bg-white/10 px-6 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 backdrop-blur-sm"
                placeholder="Enter your email"
                type="email"
              />
              <button className="flex h-14 items-center justify-center rounded-xl bg-accent-gold px-8 text-base font-bold text-white transition-all hover:opacity-90">
                Subscribe Now
              </button>
            </div>

            <p className="text-xs text-slate-400">
              By subscribing, you agree to our Privacy Policy and Terms of
              Service.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
