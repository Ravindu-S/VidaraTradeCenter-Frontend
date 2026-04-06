import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getMyOrders } from "../../api/orderApi";

const formatPrice = (value) => {
  if (value == null) return "LKR 0.00";
  return `LKR ${Number(value).toFixed(2)}`;
};

const statusColor = (status) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200";
    case "PROCESSING":
    case "SHIPPED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "FAILED":
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const paymentLabel = (status) => {
  switch (status) {
    case "COMPLETED":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "FAILED":
      return "Failed";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
};

const normalizeStatusText = (status, fallback = "") => {
  const value = typeof status === "string" ? status.trim() : "";
  return value || fallback;
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyOrders(page, 10);
        const data = res.data?.data || res.data;
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 0);
        setTotalOrders(data.totalOrders || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex items-center justify-center py-32">
          <Loader size="large" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-medium">My Orders</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"} total
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm border border-gray-100 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <span className="material-symbols-outlined text-4xl text-slate-400">receipt_long</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">You have not placed any orders yet</p>
          <p className="mt-2 text-sm text-slate-500">
            When you place an order, it will appear here.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:shadow-lg transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderStatusText = normalizeStatusText(order.orderStatus);
            const paymentStatusRaw = normalizeStatusText(order.paymentStatus, "PENDING");
            const paymentStatusText = normalizeStatusText(paymentLabel(paymentStatusRaw), "Pending");

            return (
              <Link
                key={order.id}
                to={`/order/confirmation?order=${order.orderNumber}`}
                className="block rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">receipt_long</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                      {order.orderDate && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(order.orderDate).toLocaleDateString("en-LK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {orderStatusText && (
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor(orderStatusText)}`}>
                        {orderStatusText}
                      </span>
                    )}
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor(paymentStatusRaw)}`}>
                      {paymentStatusText}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600">
                    {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </p>
                  <p className="text-base font-bold text-primary">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </Link>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <span className="text-sm text-slate-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MyOrdersPage;
