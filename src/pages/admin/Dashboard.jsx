import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
const Dashboard = () => {
  const { showError } = useToast();
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchDashboardData = async () => {
    try {
      const [statsResult, lowStockResult, outOfStockResult] = await Promise.allSettled([
        getDashboardStats(),
        getLowStockProducts(),
        getOutOfStockProducts(),
      ]);

      if (statsResult.status === "fulfilled") {
        const statsPayload = statsResult.value.data?.data || statsResult.value.data;
        setStats(statsPayload);
      } else {
        showError("Failed to load dashboard stats");
      }

      if (lowStockResult.status === "fulfilled") {
        const lowStockPayload = lowStockResult.value.data?.data || [];
        setLowStockProducts(Array.isArray(lowStockPayload) ? lowStockPayload : []);
      } else {
        setLowStockProducts([]);
        showError("Failed to load low stock alerts");
      }

      if (outOfStockResult.status === "fulfilled") {
        const outOfStockPayload = outOfStockResult.value.data?.data || [];
        setOutOfStockProducts(Array.isArray(outOfStockPayload) ? outOfStockPayload : []);
      } else {
        setOutOfStockProducts([]);
        showError("Failed to load out of stock alerts");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }
  const getStockValue = (product) => {
    if (product?.currentStock !== undefined && product?.currentStock !== null) {
      return product.currentStock;
    }
    if (product?.stock !== undefined && product?.stock !== null) {
      return product.stock;
    }
    return null;
  };
  const lowStockCount = lowStockProducts.length;
  const outOfStockCount = outOfStockProducts.length;
  const totalAlerts = lowStockCount + outOfStockCount;
  const hasInventoryAlerts = outOfStockProducts.length > 0 || lowStockProducts.length > 0;
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/admin/users",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-amber-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      link: "/admin/products",
    },
    {
      title: "Categories",
      value: stats?.totalCategories ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "bg-rose-500",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
      link: "/admin/orders",
    },
    {
      title: "Revenue",
      value: stats?.totalRevenue ? `LKR ${stats.totalRevenue.toFixed(2)}` : "LKR 0.00",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-teal-500",
      bgLight: "bg-teal-50",
      textColor: "text-teal-600",
      link: "/admin/orders",
    },
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your store's performance</p>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inventory Alerts</h2>
        {!hasInventoryAlerts ? (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">Inventory is healthy</p>
            <p className="mt-1 text-xs text-emerald-700">No low-stock or out-of-stock products at the moment.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Out Of Stock</p>
                <p className="mt-1 text-2xl font-bold text-red-800">{outOfStockCount}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Low Stock</p>
                <p className="mt-1 text-2xl font-bold text-amber-800">{lowStockCount}</p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Total Alerts</p>
                <p className="mt-1 text-2xl font-bold text-indigo-800">{totalAlerts}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-red-800">Out Of Stock</h3>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                  {outOfStockProducts.length}
                </span>
              </div>
              {outOfStockProducts.length === 0 ? (
                <p className="text-xs text-red-700">No out-of-stock products.</p>
              ) : (
                <ul className="space-y-2">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <li key={product.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                          Restock Needed
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-red-700">Stock: {getStockValue(product) ?? 0}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-800">Low Stock</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {lowStockProducts.length}
                </span>
              </div>
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-amber-700">No low-stock products.</p>
              ) : (
                <ul className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <li key={product.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          Low
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-700">
                        Stock: {getStockValue(product) ?? 0} | Threshold: {product.lowStockThreshold ?? 0}
                      </p>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-amber-100">
                        <div
                          className="h-1.5 rounded-full bg-amber-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((getStockValue(product) ?? 0) /
                                  Math.max(product.lowStockThreshold ?? 1, 1)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            </div>
          </div>
        )}
        {(lowStockProducts.length > 5 || outOfStockProducts.length > 5) && (
          <Link
            to="/admin/products"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            View more inventory items
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="relative rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {card.comingSoon && (
              <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 uppercase">
                Coming Soon
              </span>
            )}
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgLight} ${card.textColor}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
            {card.link && (
              <Link
                to={card.link}
                className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Status Breakdown</h2>
          <div className="space-y-4">
            <StatusBar label="Active" count={stats?.activeUsers ?? 0} total={stats?.totalUsers || 1} color="bg-green-500" />
            <StatusBar label="Inactive" count={stats?.inactiveUsers ?? 0} total={stats?.totalUsers || 1} color="bg-yellow-500" />
            <StatusBar label="Banned" count={stats?.bannedUsers ?? 0} total={stats?.totalUsers || 1} color="bg-red-500" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/users" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </Link>
            <Link to="/admin/products" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Manage Products</span>
            </Link>
            <Link to="/admin/products/new" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </Link>
            <Link to="/" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium text-gray-700">View Store</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatusBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
export default Dashboard;
