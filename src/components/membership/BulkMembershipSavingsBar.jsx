import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  bulkDiscountPercent,
  membershipProductDiscountPercent,
  combinedDiscountPercent,
  effectiveUnitPrice,
  retailUnitFromProduct,
  BULK_TIERS,
} from "../../utils/membershipPricing";
import { getMembershipMe } from "../../api/membershipApi";

const formatMoney = (n) => `LKR ${Number(n).toFixed(2)}`;

const BulkMembershipSavingsBar = ({ product, quantity }) => {
  const { isAuthenticated } = useAuth();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setPlan(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await getMembershipMe();
        const me = res.data?.data || res.data;
        if (cancelled) return;
        setPlan(me?.active ? me.plan : null);
      } catch {
        if (!cancelled) setPlan(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const qty = Math.max(1, Number(quantity) || 1);
  const retail = retailUnitFromProduct(product);
  const bulk = bulkDiscountPercent(qty);
  const mem = membershipProductDiscountPercent(plan);
  const totalDisc = Math.min(combinedDiscountPercent(bulk, mem), 35);
  const effUnit = effectiveUnitPrice(retail, qty, plan);
  const showYourDiscounts = bulk > 0 || mem > 0;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-amber-50/60 p-5 dark:border-slate-700 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">inventory_2</span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bulk &amp; subscription savings
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Buy <strong>5+</strong> for up to <strong>15%</strong> bulk off.{" "}
              <Link
                to="/subscriptions"
                className="font-bold text-accent-gold transition-colors hover:text-accent-gold/85"
              >
                Subscribe
              </Link>{" "}
              for an extra <strong>5–20%</strong> off everything at checkout.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BULK_TIERS.map((t) => (
                <span
                  key={t.label}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-slate-600"
                >
                  {t.label}: {t.bulk}% off
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showYourDiscounts && (
        <div className="rounded-2xl border-2 border-primary/40 bg-orange-50/90 p-5 dark:border-primary/50 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">sell</span>
            <h3 className="text-base font-bold">Your discounts</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {bulk > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-700 dark:text-slate-300">
                  Bulk discount ({qty} units)
                </span>
                <span className="font-bold text-primary">−{bulk}%</span>
              </div>
            )}
            {mem > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-700 dark:text-slate-300">Membership</span>
                <span className="font-bold text-primary">−{mem}%</span>
              </div>
            )}
            <div className="border-t border-primary/20 pt-2 flex justify-between gap-4 font-bold text-slate-900 dark:text-white">
              <span>Total savings</span>
              <span className="text-primary">−{totalDisc.toFixed(1)}%</span>
            </div>
            <p className="pt-1 text-sm text-slate-600 dark:text-slate-400">
              Unit price:{" "}
              <span className="text-slate-400 line-through">{formatMoney(retail)}</span>
              <span className="mx-1 text-primary">→</span>
              <span className="font-bold text-primary">{formatMoney(effUnit)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkMembershipSavingsBar;
