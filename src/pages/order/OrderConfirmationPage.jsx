import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getDeliveryStatus, getOrderByNumber } from "../../api/orderApi";
import DeliveryTracker from "../../components/order/DeliveryTracker";
import DeliveryStatusBadge from "../../components/order/DeliveryStatusBadge";

const formatPrice = (value) => {
  if (value == null) return "LKR 0.00";
  return `LKR ${Number(value).toFixed(2)}`;
};

const formatDateTimeLK = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return d.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateLK = (dateString) => {
  if (!dateString) return null;
  // Works for both "YYYY-MM-DD" and ISO timestamps
  const d = new Date(dateString);
  return d.toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" });
};

const statusColor = (status) => {
  switch (status) {
    // Order statuses
    case "PAID":
      return "bg-green-50 text-green-700 border-green-200";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "SHIPPED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    case "REFUNDED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    // Payment statuses
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "FAILED":
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

const OrderConfirmationPage = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order");

  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const [error, setError] = useState(null);
  const [deliveryError, setDeliveryError] = useState(null);

  const pollRef = useRef(null);
  const attemptRef = useRef(0);

  const fetchDelivery = async (ordNo) => {
    if (!ordNo) return;
    setDeliveryLoading(true);
    setDeliveryError(null);

    try {
      const res = await getDeliveryStatus(ordNo);
      const data = res.data?.data || res.data;

      // Important: "not started" responses may exist without a DB row.
      // In your backend, that typically comes without an id.
      setDelivery(data);
    } catch (err) {
      setDeliveryError(err.response?.data?.message || "Failed to load delivery tracking");
      setDelivery(null);
    } finally {
      setDeliveryLoading(false);
    }
  };

  useEffect(() => {
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
        setError(err.response?.data?.message || "Failed to load order details");
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchOrder().then((data) => {
      // Always attempt to fetch delivery tracking (non-blocking)
      fetchDelivery(orderNumber);

      // Existing payment polling logic (unchanged)
      if (data && data.paymentStatus === "PENDING") {
        pollRef.current = setInterval(async () => {
          attemptRef.current += 1;
          try {
            const res = await getOrderByNumber(orderNumber);
            const updated = res.data?.data || res.data;
            setOrder(updated);

            if (updated.paymentStatus !== "PENDING" || attemptRef.current >= 10) {
              clearInterval(pollRef.current);
            }
          } catch {
            clearInterval(pollRef.current);
          }
        }, 3000);
      }
    });

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderNumber]);

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

  const isRefunded = order.orderStatus === "REFUNDED" || order.paymentStatus === "REFUNDED";
  const isCancelled = order.orderStatus === "CANCELLED";
  const isPaidLike =
    order.paymentStatus === "COMPLETED" ||
    ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.orderStatus);

  const addr = order.shippingAddress;

  // Delivery details (safe defaults)
  const trackingExists = !!delivery?.id; // real DB record
  const deliveryStatus = delivery?.status || "PREPARING";

  const estimatedDateText = delivery?.estimatedDeliveryDate ? formatDateLK(delivery.estimatedDeliveryDate) : null;
  const actualDateText = delivery?.actualDeliveryDate ? formatDateLK(delivery.actualDeliveryDate) : null;

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/orders" className="hover:text-primary transition-colors">
            My Orders
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-medium">Order Confirmation</span>
        </nav>
      </div>

      {/* Payment / Order state banner */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isPaidLike ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isPaidLike ? "verified" : "schedule"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isPaidLike ? "Payment Successful!" : "Order Placed — Awaiting Payment Confirmation"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {isPaidLike
                ? "Your payment has been received and your order is being processed."
                : "We're confirming your payment with PayHere. This usually takes a few seconds..."}
            </p>

            {!isPaidLike && order.paymentStatus === "PENDING" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></span>
                Checking payment status...
              </div>
            )}

            {(isCancelled || isRefunded) && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <span className="material-symbols-outlined text-base">info</span>
                {isRefunded
                  ? "This order has been refunded. Delivery tracking may not be available."
                  : "This order has been cancelled. Delivery tracking is not available."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Number</p>
                <p className="mt-1 text-xl font-bold text-primary">{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor(order.paymentStatus)}`}>
                  {statusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>

            {order.orderDate && (
              <p className="mt-3 text-xs text-slate-500">Placed on {formatDateTimeLK(order.orderDate)}</p>
            )}
          </div>

          {/* ✅ Delivery Tracking (NEW) */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Delivery Tracking
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Track your delivery status and estimated delivery date.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchDelivery(order.orderNumber)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                Refresh
              </button>
            </div>

            {/* Loading / error */}
            {deliveryLoading ? (
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></span>
                Loading delivery tracking...
              </div>
            ) : deliveryError ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {deliveryError}
              </div>
            ) : isCancelled || isRefunded ? (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Delivery tracking is unavailable for this order.
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <DeliveryStatusBadge status={deliveryStatus} />
                    {delivery?.statusDescription && (
                      <span className="text-sm text-slate-600">{delivery.statusDescription}</span>
                    )}
                  </div>

                  {estimatedDateText && (
                    <div className="text-sm text-slate-700">
                      <span className="text-slate-500">Estimated:</span>{" "}
                      <span className="font-bold">{estimatedDateText}</span>
                    </div>
                  )}
                </div>

                {/* Tracking details */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Courier</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {delivery?.courierName || "Not assigned yet"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tracking Number</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {delivery?.trackingNumber || "Not available yet"}
                    </p>
                  </div>
                </div>

                {/* Progress tracker */}
                <div className="mt-5">
                  <DeliveryTracker
                    status={deliveryStatus}
                    estimatedDate={estimatedDateText}
                    actualDate={actualDateText}
                    trackingNumber={delivery?.trackingNumber}
                    courierName={delivery?.courierName}
                  />
                </div>

                {/* Notes */}
                {trackingExists && delivery?.notes && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-base">info</span>
                      <div>
                        <p className="font-bold">Delivery note</p>
                        <p className="mt-1">{delivery.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Not started message (no DB row) */}
                {!trackingExists && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Tracking is not available yet. Once your order is packed and handed over to a courier,
                    you will see the tracking number and delivery progress here.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Items */}
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

          {/* Shipping */}
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

        {/* Right */}
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