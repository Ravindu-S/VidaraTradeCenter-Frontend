import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMembershipPlans,
  createMembershipCheckout,
  reconcileSandboxMembership,
} from "../../api/membershipApi";
import { initiatePayment } from "../../api/paymentApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../common/Loader";
import { BULK_TIERS, withProCombinedPercent } from "../../utils/membershipPricing";

const formatMoney = (n) => `LKR ${Number(n).toFixed(2)}`;

const PLAN_RANK = { STARTER: 0, PROFESSIONAL: 1, ENTERPRISE: 2 };

function ctaLabel(membershipMe, planCode, billing) {
  if (!membershipMe?.active) return "Subscribe now";
  const samePlan = membershipMe.plan === planCode;
  const sameBilling = membershipMe.billingPeriod === billing;
  if (samePlan && sameBilling) return "Current plan";
  if (samePlan) return "Change billing";
  const cur = PLAN_RANK[membershipMe.plan] ?? 0;
  const next = PLAN_RANK[planCode] ?? 0;
  if (next > cur) return "Upgrade";
  if (next < cur) return "Downgrade";
  return "Switch plan";
}

/**
 * Plan cards + billing toggle + bulk table. Used on My memberships page.
 * @param {object} props
 * @param {object|null} props.membershipMe — `/membership/me` payload when parent already loaded it
 */
const MembershipPlansSection = ({ membershipMe = null }) => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState("MONTHLY");
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMembershipPlans();
        const data = res.data?.data || res.data;
        if (!cancelled) setPlans(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setPlans([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startPayHereMembership = useCallback(
    async (planCode) => {
      if (typeof window.payhere === "undefined" || !window.payhere.startPayment) {
        showError("Payment library not loaded. Refresh the page and try again.");
        return;
      }
      setSubmitting(planCode);
      try {
        const checkoutRes = await createMembershipCheckout({
          plan: planCode,
          billingPeriod: billing,
        });
        const co = checkoutRes.data?.data || checkoutRes.data;
        const orderNumber = co?.orderNumber;
        if (!orderNumber) {
          showError("Could not start checkout");
          return;
        }

        const res = await initiatePayment(orderNumber);
        const pd = res.data?.data || res.data;
        const paymentSandbox = pd.sandbox === true;

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

        window.payhere.onCompleted = async function () {
          setSubmitting(null);
          showSuccess("Payment completed — your membership will update in a moment.");
          if (paymentSandbox) {
            try {
              await reconcileSandboxMembership({ orderNumber });
            } catch {
              /* Live/sandbox with notify only, or reconcile disabled — rely on PayHere notify + page refresh */
            }
          }
          navigate("/subscriptions?membershipPaid=1");
        };

        window.payhere.onDismissed = function () {
          setSubmitting(null);
          showError("Payment was dismissed. You can try again when you're ready.");
        };

        window.payhere.onError = function (err) {
          setSubmitting(null);
          showError("Payment error: " + err);
        };

        window.payhere.startPayment(payment);
      } catch (err) {
        setSubmitting(null);
        showError(err.response?.data?.message || "Could not start payment");
      }
    },
    [billing, navigate, showError, showSuccess]
  );

  const displayPrice = (p) => (billing === "YEARLY" ? p.yearlyPrice : p.monthlyPrice);
  const periodSuffix = billing === "YEARLY" ? "/yr" : "/mo";

  const onPlanCta = (planCode) => {
    const label = ctaLabel(membershipMe, planCode, billing);
    if (label === "Current plan") return;
    startPayHereMembership(planCode);
  };

  if (loading) {
    return (
      <div className="mt-10 flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Member savings</h2>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
        Choose a plan for an automatic discount on every product. Stack with bulk pricing when you buy 5 or more units.
        Subscriptions are activated after successful payment.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-semibold text-slate-600">Billing</span>
        <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setBilling("MONTHLY")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              billing === "MONTHLY"
                ? "bg-accent-gold text-white shadow"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("YEARLY")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              billing === "YEARLY"
                ? "bg-accent-gold text-white shadow"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Yearly <span className="text-xs font-normal opacity-90">(save ~17%)</span>
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const popular = p.mostPopular;
          const price = displayPrice(p);
          const cta = ctaLabel(membershipMe, p.plan, billing);
          const isCurrent = cta === "Current plan";
          return (
            <div
              key={p.plan}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900/50 ${
                popular
                  ? "border-accent-gold ring-2 ring-accent-gold/40 md:scale-[1.02]"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-gold px-3 py-0.5 text-xs font-bold text-white">
                  Most popular
                </span>
              )}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold">
                <span className="material-symbols-outlined">
                  {p.plan === "STARTER"
                    ? "bolt"
                    : p.plan === "PROFESSIONAL"
                      ? "workspace_premium"
                      : "apartment"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-3xl font-bold text-accent-gold">
                {formatMoney(price)}
                <span className="text-base font-semibold text-slate-500">{periodSuffix}</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{p.subtitle}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {(p.features || []).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="material-symbols-outlined shrink-0 text-lg text-accent-gold">check</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!!submitting || isCurrent}
                onClick={() => onPlanCta(p.plan)}
                className={`mt-6 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold transition ${
                  popular
                    ? "bg-accent-gold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    : "border-2 border-slate-200 bg-white text-slate-900 hover:border-accent-gold dark:border-slate-600 dark:text-white dark:hover:border-accent-gold disabled:cursor-not-allowed disabled:opacity-50"
                }`}
              >
                {submitting === p.plan ? "Please wait…" : cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-slate-500">table</span>
          Bulk pricing
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Buy in larger quantities for additional discounts. Bulk discounts stack with your Professional membership at
          checkout.
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500 dark:border-slate-700">
              <th className="py-2">Quantity</th>
              <th className="py-2">Bulk discount</th>
              <th className="py-2">With Pro plan</th>
            </tr>
          </thead>
          <tbody>
            {BULK_TIERS.map((t) => (
              <tr key={t.label} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 text-slate-700 dark:text-slate-300">{t.label}</td>
                <td className="py-2">{t.bulk}% off</td>
                <td className="py-2 font-bold text-accent-gold">{withProCombinedPercent(t.bulk).toFixed(0)}% off</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">
          Maximum combined discount is capped at 35%. Discounts are applied automatically at checkout.
        </p>
      </div>
    </div>
  );
};

export default MembershipPlansSection;
