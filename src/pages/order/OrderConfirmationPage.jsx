import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getOrderByNumber } from "../../api/orderApi";

const formatPrice = (value) => {
  if (value == null) return "LKR 0.00";
  return `LKR ${Number(value).toFixed(2)}`;
};

const statusColor = (status) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "FAILED":
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const statusLabel = (status) => {
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

const OrderConfirmationPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = params.get("order");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const redirectRef = useRef(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (redirectRef.current) {
      clearTimeout(redirectRef.current);
      redirectRef.current = null;
    }
    attemptRef.current = 0;

    if (!orderNumber) {
      setError("No order number provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await getOrderByNumber(orderNumber);
        const data = res.data?.data || res.data;
        setOrder(data);
        return data;
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError("You cannot view this order. Redirecting to My Orders...");
          redirectRef.current = setTimeout(() => navigate("/orders"), 2000);
        } else if (status === 404) {
          setError("Order not found. Redirecting to My Orders...");
          redirectRef.current = setTimeout(() => navigate("/orders"), 2000);
        } else {
          setError(err.response?.data?.message || "Failed to load order details");
        }
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchOrder().then((data) => {
      if (data?.paymentStatus === "PENDING") {
        pollRef.current = setInterval(async () => {
          attemptRef.current += 1;
          try {
            const res = await getOrderByNumber(orderNumber);
            const updated = res.data?.data || res.data;
            setOrder(updated);
            if (updated.paymentStatus !== "PENDING" || attemptRef.current >= 10) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          } catch (err) {
            const status = err.response?.status;
            clearInterval(pollRef.current);
            pollRef.current = null;
            if (status === 403) {
              setError("You cannot view this order. Redirecting to My Orders...");
              if (!redirectRef.current) {
                redirectRef.current = setTimeout(() => navigate("/orders"), 2000);
              }
            } else if (status === 404) {
              setError("Order not found. Redirecting to My Orders...");
              if (!redirectRef.current) {
                redirectRef.current = setTimeout(() => navigate("/orders"), 2000);
              }
            }
          }
        }, 3000);
      }
    });

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
        redirectRef.current = null;
      }
    };
  }, [navigate, orderNumber]);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
        <div className="flex items-center justify-center py-32">
          <Loader size="large" />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{error}</p>
          <Link
            to="/products"
            className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const paid = order.paymentStatus === "COMPLETED" || order.orderStatus === "PAID";
  const orderStatusText = normalizeStatusText(order.orderStatus);
  const paymentStatusRaw = normalizeStatusText(order.paymentStatus, "PENDING");
  const paymentStatusText = normalizeStatusText(statusLabel(paymentStatusRaw), "Pending");
  const addr = order.shippingAddress;

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-medium">Order Confirmation</span>
        </nav>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            paid ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
          }`}>
            <span className="material-symbols-outlined text-2xl">
              {paid ? "verified" : "schedule"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {paid ? "Payment Successful!" : "Order Placed — Awaiting Payment Confirmation"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {paid
                ? "Your payment has been received and your order is being processed."
                : "We're confirming your payment with PayHere. This usually takes a few seconds..."}
            </p>
            {!paid && order.paymentStatus === "PENDING" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></span>
                Checking payment status...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Number</p>
                <p className="mt-1 text-xl font-bold text-primary">{order.orderNumber}</p>
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
            {order.orderDate && (
              <p className="mt-3 text-xs text-slate-500">
                Placed on{" "}
                {new Date(order.orderDate).toLocaleDateString("en-LK", {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Items Ordered</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Qty: {item.quantity} &times; {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {addr && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Shipping Address</h2>
              <div className="mt-4 text-sm text-slate-700 space-y-1">
                <p className="font-bold">{addr.fullName}</p>
                <p>{addr.phone}</p>
                <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                <p>{addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.postalCode ? ` ${addr.postalCode}` : ""}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Payment Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Tax</span>
                <span className="font-bold text-slate-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-base font-bold text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              View My Orders
            </Link>
            <Link
              to="/products"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-8 text-base font-bold text-slate-700 transition-transform active:scale-95 hover:shadow-sm"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
