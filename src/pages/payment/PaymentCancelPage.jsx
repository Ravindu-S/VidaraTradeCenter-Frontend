import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentCancelPage = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <span className="material-symbols-outlined text-5xl text-amber-500">warning</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="mt-3 max-w-md text-slate-600">
          {orderNumber?.startsWith("MS") ? (
            <>
              Membership checkout{" "}
              <span className="font-bold text-accent-gold">{orderNumber}</span> was cancelled. You can try again from
              My memberships.
            </>
          ) : (
            <>
              Payment for order{" "}
              <span className="font-bold text-primary">{orderNumber || "—"}</span> was cancelled. Your order is still
              saved — you can retry the payment at any time.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {orderNumber?.startsWith("MS") ? (
            <Link
              to="/subscriptions"
              className="flex h-12 items-center justify-center rounded-xl bg-accent-gold px-6 text-sm font-bold text-white hover:opacity-95"
            >
              Back to memberships
            </Link>
          ) : (
            <Link
              to="/products"
              className="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white hover:shadow-lg"
            >
              Continue Shopping
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelPage;
