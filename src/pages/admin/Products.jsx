import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, deleteAdminProduct } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatters";

const Products = () => {
  const { showSuccess, showError } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminProducts({
        search: search || undefined,
        page,
        size,
        sortBy,
        sortDir: direction,
      });
      setData(response.data?.data || response.data);
    } catch (err) {
      showError("Failed to load products");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, size, sortBy, direction]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    setActionLoading(productId);
    try {
      await deleteAdminProduct(productId);
      showSuccess("Product deleted successfully");
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("asc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">&#8645;</span>;
    return <span className="text-indigo-600 ml-1">{direction === "asc" ? "\u2191" : "\u2193"}</span>;
  };

  const statusColors = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    INACTIVE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    DRAFT: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const products = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your store products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Search
          </button>

          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setPage(0); }}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No products found</p>
            <Link
              to="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Product</th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("sku")}
                  >
                    SKU <SortIcon field="sku" />
                  </th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("basePrice")}
                  >
                    Price <SortIcon field="basePrice" />
                  </th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("stock")}
                  >
                    Stock <SortIcon field="stock" />
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Brand</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created <SortIcon field="createdAt" />
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.primaryImageUrl ? (
                          <img
                            src={product.primaryImageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* SKU */}
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">{product.sku}</span>
                    </td>
                    {/* Price */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-gray-900">{formatPrice(product.basePrice)}</p>
                        {product.salePrice && (
                          <p className="text-xs text-green-600">{formatPrice(product.salePrice)}</p>
                        )}
                      </div>
                    </td>
                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {product.stock > 0 ? (
                          <>
                            {product.stock <= (product.lowStockThreshold || 10) ? (
                              <>
                                <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                                <span className="text-orange-600 font-medium">{product.stock}</span>
                              </>
                            ) : (
                              <>
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-gray-900 font-medium">{product.stock}</span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                            <span className="text-red-600 font-medium">0</span>
                          </>
                        )}
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-3.5 text-gray-600">{product.categoryName || "—"}</td>
                    {/* Brand */}
                    <td className="px-5 py-3.5 text-gray-600">{product.brandName || "—"}</td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[product.status] || statusColors.DRAFT}`}>
                        {product.status}
                      </span>
                    </td>
                    {/* Created */}
                    <td className="px-5 py-3.5 text-gray-500">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Edit
                        </Link>

                        {/* Delete */}
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={actionLoading === product.id}
                              className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="rounded-lg px-2 py-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                            title="Delete"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages} ({data?.totalElements} total)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const pageNum = start + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${page === pageNum
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
