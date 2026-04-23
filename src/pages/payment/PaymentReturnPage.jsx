import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

const PaymentReturnPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = params.get("order");

  useEffect(() => {
    const timer = setTimeout(() => {
      const order = orderNumber || "";
      if (order.startsWith("MS")) {
        navigate(`/subscriptions?membershipPaid=1`, { replace: true });
      } else {
        navigate(`/order/confirmation?order=${order}`, { replace: true });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate, orderNumber]);

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader size="large" />
        <p className="mt-6 text-sm text-slate-600">
          {orderNumber?.startsWith("MS")
            ? "Redirecting to your memberships…"
            : "Redirecting to your order confirmation…"}
        </p>
      </div>
    </section>
  );
};

export default PaymentReturnPage;
