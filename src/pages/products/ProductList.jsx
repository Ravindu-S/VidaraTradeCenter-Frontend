import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories, getBrands } from "../../api/productApi";
import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/product/Pagination";
import Loader from "../../components/common/Loader";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || ""
  );
  const [brandId, setBrandId] = useState(searchParams.get("brand") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortDir, setSortDir] = useState(
    searchParams.get("sortDir") || "desc"
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  // Fetch categories and brands once
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data?.data || catRes.data || []);
        setBrands(brandRes.data?.data || brandRes.data || []);
      } catch (err) {
        console.error("Failed to load filter data:", err);
      }
    };
    fetchFiltersData();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size: 12, sortBy, sortDir };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (brandId) params.brandId = brandId;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await getProducts(params);
      const apiData = response.data?.data || response.data;

      if (apiData?.content) {
        setProducts(apiData.content);
        setTotalPages(apiData.totalPages || 0);
        setTotalElements(apiData.totalElements || 0);
      } else if (Array.isArray(apiData)) {
        setProducts(apiData);
        setTotalPages(1);
        setTotalElements(apiData.length);
      } else {
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, brandId, sortBy, sortDir, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (page > 0) params.page = page;
    if (search) params.search = search;
    if (categoryId) params.category = categoryId;
    if (brandId) params.brand = brandId;
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (sortDir !== "desc") params.sortDir = sortDir;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params, { replace: true });
  }, [
    page,
    search,
    categoryId,
    brandId,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    setSearchParams,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategoryId("");
    setBrandId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortDir("desc");
    setPage(0);
  };

  const hasActiveFilters =
    search || categoryId || brandId || minPrice || maxPrice;

  // Flatten nested categories for sidebar display
  const flattenCategories = (cats, depth = 0) => {
    let result = [];
    for (const cat of cats) {
      result.push({ ...cat, depth });
      if (cat.subcategories?.length > 0) {
        result = result.concat(
          flattenCategories(cat.subcategories, depth + 1)
        );
      }
    }
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12 lg:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          All Products
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {totalElements > 0
            ? `${totalElements} product${totalElements !== 1 ? "s" : ""} found`
            : "Browse our collection"}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <label className="relative block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    search
                  </span>
                </span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>
            </form>

            {/* Categories */}
            {flatCategories.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCategoryId("");
                      setPage(0);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!categoryId
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                  >
                    All Categories
                  </button>
                  {flatCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(String(cat.id));
                        setPage(0);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${String(categoryId) === String(cat.id)
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      style={{ paddingLeft: `${12 + cat.depth * 16}px` }}
                    >
                      {cat.depth > 0 && (
                        <span className="mr-1 text-slate-300">└</span>
                      )}
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setBrandId("");
                      setPage(0);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!brandId
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setBrandId(String(brand.id));
                        setPage(0);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${String(brandId) === String(brand.id)
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Price Range
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Min"
                  min="0"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Max"
                  min="0"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {!loading &&
                `Showing ${products.length} of ${totalElements} products`}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">
                Sort by:
              </label>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [newSort, newDir] = e.target.value.split("-");
                  setSortBy(newSort);
                  setSortDir(newDir);
                  setPage(0);
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="basePrice-asc">Price: Low to High</option>
                <option value="basePrice-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <span className="material-symbols-outlined text-4xl text-red-500">
                  cloud_off
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {error}
              </p>
              <button
                onClick={fetchProducts}
                className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="material-symbols-outlined text-4xl text-slate-400">
                  inventory_2
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                No products found
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms."
                  : "Check back soon for new arrivals."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
