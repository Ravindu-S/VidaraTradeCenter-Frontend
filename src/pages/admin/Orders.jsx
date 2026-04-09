import React, { useState, useEffect, useCallback } from "react";
import { getAdminOrders, getAdminOrderStats, getAdminOrderById, updateAdminOrderStatus } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import RefundModal from "../../components/order/RefundModal";

const formatPrice = (v) => (v != null ? `LKR ${Number(v).toFixed(2)}` : "LKR 0.00");

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const PAYMENT_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"];

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

const TRANSITIONS = {
  // Keep paid action
  PENDING: ["PAID", "CANCELLED"],

  // Remove delivery progression actions from Orders page
  // (no PROCESSING / SHIPPED / DELIVERED buttons here)
  PAID: ["CANCELLED"],
  PROCESSING: ["CANCELLED"],
  SHIPPED: ["CANCELLED"],

  // Terminal states
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const transitionButtonStyle = {
  PROCESSING: "text-blue-600 hover:bg-blue-50",
  SHIPPED: "text-indigo-600 hover:bg-indigo-50",
  DELIVERED: "text-emerald-600 hover:bg-emerald-50",
  CANCELLED: "text-red-600 hover:bg-red-50",
  PAID: "text-green-600 hover:bg-green-50",
};

const Orders = () => {
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortDir, setSortDir] = useState("desc");

  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    order: null,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 15, sortBy, sortDir };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;

      const res = await getAdminOrders(params);
      const data = res.data?.data || res.data;
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalItems || 0);
    } catch {
      showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDir, search, statusFilter, paymentFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAdminOrderStats();
      setStats(res.data?.data || res.data);
    } catch {
      /* stats are non-critical */
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchOrders();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      showSuccess(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
      if (expandedId === orderId) {
        const res = await getAdminOrderById(orderId);
        setExpandedOrder(res.data?.data || res.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      setExpandedOrder(null);
      return;
    }
    setExpandedId(orderId);
    setExpandedOrder(null);
    setDetailLoading(true);
    try {
      const res = await getAdminOrderById(orderId);
      setExpandedOrder(res.data?.data || res.data);
    } catch {
      showError("Failed to load order details");
      setExpandedId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">&#8645;</span>;
    return <span className="text-indigo-600 ml-1">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>;
  };

  const handleRefundClick = (order) => {
    if (!["PAID", "PROCESSING", "DELIVERED"].includes(order.orderStatus)) {
      showError("This order cannot be refunded");
      return;
    }
    setRefundModal({ isOpen: true, order });
  };

  const handleRefundSuccess = () => {
    setRefundModal({ isOpen: false, order: null });
    fetchOrders();
    fetchStats();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all customer orders</p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 mb-6">
          <StatCard label="Total Orders" value={stats.totalOrders} color="bg-gray-900" />
          <StatCard label="Pending" value={stats.pendingOrders} color="bg-amber-500" />
          <StatCard label="Processing" value={stats.processingOrders} color="bg-blue-500" />
          <StatCard label="Shipped" value={stats.shippedOrders} color="bg-indigo-500" />
          <StatCard label="Delivered" value={stats.deliveredOrders} color="bg-emerald-500" />
          <StatCard label="Paid" value={stats.paidOrders} color="bg-green-500" />
          <StatCard label="Cancelled" value={stats.cancelledOrders} color="bg-red-500" />
          <StatCard label="Today" value={stats.todayOrders} color="bg-violet-500" />
          <StatCard label="Revenue" value={formatPrice(stats.totalRevenue)} color="bg-teal-500" wide />
          <StatCard label="Today Revenue" value={formatPrice(stats.todayRevenue)} color="bg-cyan-500" wide />
        </div>
      )}

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
                placeholder="Order number, customer name or email..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="sm:w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="sm:w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment</label>
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(0); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All</option>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button type="submit" className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Search
          </button>

          {(search || statusFilter || paymentFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter(""); setPaymentFilter(""); setPage(0); }}
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
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-8 px-3 py-3" />
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("orderNumber")}
                  >
                    Order <SortIcon field="orderNumber" />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Items</th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Total <SortIcon field="totalAmount" />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Order Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Payment</th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("orderDate")}
                  >
                    Date <SortIcon field="orderDate" />
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const transitions = TRANSITIONS[order.orderStatus] || [];
                  const isExpanded = expandedId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr className={`hover:bg-gray-50/50 transition-colors ${isExpanded ? "bg-indigo-50/30" : ""}`}>
                        {/* Expand */}
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                        {/* Order number */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-indigo-600">{order.orderNumber}</span>
                        </td>
                        {/* Customer */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-xs">{order.customerName}</p>
                          <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                        </td>
                        {/* Items */}
                        <td className="px-4 py-3 text-gray-600">{order.itemCount}</td>
                        {/* Total */}
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                        {/* Order status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[order.orderStatus] || ""}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        {/* Payment */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[order.paymentStatus] || ""}`}>
                            {order.paymentStatus === "COMPLETED" ? "Paid" : order.paymentStatus}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })
                            : "N/A"}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {transitions.map((t) => (
                              <button
                                key={t}
                                onClick={() => handleStatusUpdate(order.id, t)}
                                disabled={actionLoading === order.id}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${transitionButtonStyle[t] || "text-gray-600 hover:bg-gray-50"}`}
                              >
                                {t === "CANCELLED" ? "Cancel" : t.charAt(0) + t.slice(1).toLowerCase()}
                              </button>
                            ))}
                            {["PAID", "PROCESSING", "DELIVERED"].includes(order.orderStatus) && (
                              <button
                                onClick={() => handleRefundClick(order)}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="bg-gray-50/60 px-6 py-5 border-b border-gray-100">
                            {detailLoading ? (
                              <div className="flex items-center justify-center py-6">
                                <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              </div>
                            ) : expandedOrder ? (
                              <OrderDetail order={expandedOrder} />
                            ) : null}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages} ({totalItems} total)
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
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page === pageNum ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
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
      <RefundModal
        isOpen={refundModal.isOpen}
        onClose={() => setRefundModal({ isOpen: false, order: null })}
        order={refundModal.order}
        onRefundSuccess={handleRefundSuccess}
      />
    </div>
  );
};

const OrderDetail = ({ order }) => {
  const addr = order.shippingAddress;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Items */}
      <div className="lg:col-span-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items Ordered</h3>
        <div className="rounded-xl bg-white border border-gray-100 divide-y divide-gray-50">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} &times; {formatPrice(item.unitPrice)}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* Totals */}
        <div className="rounded-xl bg-white border border-gray-100 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="text-gray-900">{formatPrice(order.tax)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-900">{formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-indigo-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        {addr && (
          <div className="rounded-xl bg-white border border-gray-100 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{addr.fullName}</p>
              <p>{addr.phone}</p>
              <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
              <p>{addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.postalCode ? ` ${addr.postalCode}` : ""}</p>
              <p>{addr.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, wide }) => (
  <div className={`rounded-xl bg-white p-4 shadow-sm border border-gray-100 ${wide ? "sm:col-span-2 lg:col-span-1" : ""}`}>
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
);

export default Orders;
