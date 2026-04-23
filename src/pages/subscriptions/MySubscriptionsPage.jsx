import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getMembershipMe, cancelMembership } from "../../api/membershipApi";
import { useToast } from "../../context/ToastContext";
import MembershipPlansSection from "../../components/membership/MembershipPlansSection";

const MySubscriptionsPage = () => {
  const { showSuccess, showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (options = {}) => {
    const silent = options.silent === true;
    if (!silent) setLoading(true);
    try {
      const res = await getMembershipMe();
      setMe(res.data?.data || res.data);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load membership");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get("membershipPaid") !== "1") return;
    showSuccess("Payment received — updating your membership…");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("membershipPaid");
    setSearchParams(next, { replace: true });
    load({ silent: true });
    const retry = setTimeout(() => load({ silent: true }), 2500);
    return () => clearTimeout(retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onCancel = async () => {
    if (!window.confirm("Cancel your membership? You will lose checkout discounts until you subscribe again."))
      return;
    try {
      await cancelMembership();
      showSuccess("Membership cancelled");
      await load({ silent: true });
    } catch (err) {
      showError(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
        <div className="flex justify-center py-24">
          <Loader size="large" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
      <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="transition-colors hover:text-accent-gold">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">My memberships</span>
      </nav>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My memberships</h1>
      <p className="mt-1 text-sm text-slate-500">
        Your store-wide discount for every product, combined with bulk savings at checkout.
      </p>

      {!me?.active && (
        <p className="mt-4 text-base font-medium text-slate-600 dark:text-slate-400">No plans active</p>
      )}

      {me?.active && (
        <div className="mt-6 rounded-2xl border-2 border-accent-gold/35 bg-white p-8 shadow-sm dark:border-accent-gold/40 dark:bg-slate-900/40">
          <p className="text-sm font-bold uppercase tracking-wide text-accent-gold">Active</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{me.plan}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Billing: {me.billingPeriod} · {me.productDiscountPercent}% off all products at checkout
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-bold text-white hover:bg-red-700"
            >
              Cancel membership
            </button>
          </div>
        </div>
      )}

      <MembershipPlansSection membershipMe={me} />
    </section>
  );
};

export default MySubscriptionsPage;
