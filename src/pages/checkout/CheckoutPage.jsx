import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";
import { getAddresses } from "../../api/addressApi";
import { placeOrder } from "../../api/checkoutApi";
import { initiatePayment } from "../../api/paymentApi";

const formatPrice = (value) => {
  if (value == null) return "LKR 0.00";
  return `LKR ${Number(value).toFixed(2)}`;
};

const CheckoutPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createdOrder, setCreatedOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await getAddresses();
        const data = response.data?.data || response.data || [];
        const normalized = Array.isArray(data) ? data : [];
        setAddresses(normalized);

        const defaultAddr =
          normalized.find((a) => a.isDefault || a.default) || normalized[0];
        setSelectedAddressId(defaultAddr?.id ?? null);
      } catch {
        setError("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const startPayHerePayment = useCallback(
    async (orderNumber) => {
      setPaymentLoading(true);
      setError(null);
      try {
        const res = await initiatePayment(orderNumber);
        const pd = res.data?.data || res.data;

        const payment = {
          sandbox: pd.sandbox,
          merchant_id: pd.merchantId,
          return_url: pd.returnUrl,
          cancel_url: pd.cancelUrl,
          notify_url: pd.notifyUrl,
          order_id: pd.orderId,
          items: pd.items,
          amount: pd.amount,
          currency: pd.currency,
          hash: pd.hash,
          first_name: pd.firstName,
          last_name: pd.lastName,
          email: pd.email,
          phone: pd.phone,
          address: pd.address,
          city: pd.city,
          country: pd.country,
        };

        window.payhere.onCompleted = function (orderId) {
          setPaymentLoading(false);
          showSuccess("Payment completed for order " + orderId);
          navigate("/order/confirmation?order=" + orderId);
        };

        window.payhere.onDismissed = function () {
          setPaymentLoading(false);
          showError("Payment was dismissed. You can retry from the order screen.");
        };

        window.payhere.onError = function (err) {
          setPaymentLoading(false);
          setError("Payment error: " + err);
          showError("Payment error: " + err);
        };

        window.payhere.startPayment(payment);
      } catch (err) {
        setPaymentLoading(false);
        const message =
          err.response?.data?.message || "Failed to initiate payment";
        setError(message);
        showError(message);
      }
    },
    [showSuccess, showError, navigate]
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    setPlacing(true);
    setError(null);
    try {
      const response = await placeOrder(selectedAddressId);
      const data = response.data?.data || response.data;
      setCreatedOrder(data);
      showSuccess("Order created — proceeding to payment");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to place order";
      setError(message);
      showError(message);
    } finally {
      setPlacing(false);
    }
  };

  const cartItems = cart?.items || [];
  const cartTotal = cart?.totalAmount || 0;

  // Order placed — show payment screen
  if (createdOrder) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complete Payment
          </h1>
          <Link
            to="/products"
            className="text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Your order number
                </p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {createdOrder.orderNumber || "-"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Click the button below to pay securely via PayHere.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={paymentLoading}
              onClick={() => startPayHerePayment(createdOrder.orderNumber)}
              className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-accent-gold px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">payment</span>
              {paymentLoading ? "Opening PayHere..." : "Pay with PayHere"}
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Order Summary
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Total</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(createdOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show loader while cart or addresses are still loading
  if (loading || cartLoading || !cart) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex items-center justify-center py-32">
          <Loader size="large" />
        </div>
      </section>
    );
  }

  // Empty cart (only checked after cart is confirmed loaded)
  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Checkout
        </h1>
        <p className="mt-2 text-slate-500">Your cart is empty.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:shadow-lg transition"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-medium">Checkout</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Cart items review */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Items ({cartItems.length})
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-14 w-14 rounded-xl object-cover bg-slate-100"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                        <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Qty: {item.quantity} &times; {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address selection */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Shipping Address
            </h2>

            {addresses.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">No saved addresses</p>
                <p className="mt-2 text-sm text-slate-600">
                  Add a shipping address to continue checkout.
                </p>
                <Link
                  to="/profile/addresses"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg transition"
                >
                  Add Address
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((addr) => {
                  const active = Number(selectedAddressId) === Number(addr.id);
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {addr.label && (
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {addr.label}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {addr.recipientName}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">{addr.phone}</p>
                        </div>
                        {(addr.isDefault || addr.default) && (
                          <span className="rounded-full bg-accent-gold/10 px-2 py-0.5 text-[10px] font-bold text-accent-gold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        {addr.street}
                        {addr.city ? `, ${addr.city}` : ""}
                        {addr.state ? `, ${addr.state}` : ""}
                        {addr.zipCode ? ` ${addr.zipCode}` : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: summary */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Order Summary
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-slate-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-base font-bold text-primary">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={placing || !selectedAddressId || cartItems.length === 0 || addresses.length === 0}
              onClick={handlePlaceOrder}
              className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">lock</span>
              {placing ? "Placing Order..." : "Place Order & Pay"}
            </button>

            <p className="mt-3 text-xs text-slate-500">
              You will be redirected to PayHere to complete payment securely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
