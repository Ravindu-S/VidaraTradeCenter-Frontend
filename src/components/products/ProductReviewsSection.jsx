import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getProductReviews,
  getMyProductReview,
  submitProductReview,
} from "../../api/productApi";
import { useToast } from "../../context/ToastContext";

const StarRow = ({ value, onChange, disabled, size = "md" }) => {
  const sz = size === "lg" ? "text-3xl" : "text-xl";
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={`${sz} leading-none transition-colors disabled:opacity-50 ${
            n <= value ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
          }`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={n <= value}
        >
          <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        </button>
      ))}
    </div>
  );
};

const ProductReviewsSection = ({ productId, isAuthenticated }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    averageRating: 0,
    reviewCount: 0,
    reviews: [],
  });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductReviews(productId);
      const data = res.data?.data || res.data;
      setSummary({
        averageRating: data?.averageRating ?? 0,
        reviewCount: data?.reviewCount ?? 0,
        reviews: data?.reviews ?? [],
      });
    } catch {
      showError("Could not load reviews.");
      setSummary({ averageRating: 0, reviewCount: 0, reviews: [] });
    } finally {
      setLoading(false);
    }
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps -- showError stable

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (!isAuthenticated || !productId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyProductReview(productId);
        const mine = res.data?.data;
        if (cancelled || mine == null) return;
        setRating(mine.rating ?? 5);
        setComment(mine.comment ?? "");
      } catch {
        /* no existing review */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 3) {
      showError("Please write at least a few words for your review.");
      return;
    }
    setSubmitting(true);
    try {
      await submitProductReview(productId, {
        rating,
        comment: comment.trim(),
      });
      showSuccess("Your review was saved.");
      await loadReviews();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not save your review. Please try again.";
      showError(typeof msg === "string" ? msg : "Could not save review.");
    } finally {
      setSubmitting(false);
    }
  };

  const { averageRating, reviewCount, reviews } = summary;

  return (
    <div className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Customer reviews
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Ratings and reviews from people who bought or used this product.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
          <span className="text-3xl font-bold text-amber-500 tabular-nums">
            {reviewCount > 0 ? averageRating.toFixed(1) : "—"}
          </span>
          <div>
            <StarRow value={Math.round(averageRating) || 0} onChange={() => {}} disabled size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Write a review
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You can update your review anytime — only your latest rating and text are shown.
          </p>
          <div className="mt-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your rating
            </span>
            <div className="mt-2">
              <StarRow value={rating} onChange={setRating} disabled={submitting} size="lg" />
            </div>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your review
            </span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={4000}
              disabled={submitting}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="What did you think of this product?"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Post review"}
          </button>
        </form>
      ) : (
        <div className="mb-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center dark:border-slate-700 dark:bg-slate-900/30">
          <p className="text-slate-600 dark:text-slate-400">
            <Link to="/login" className="font-semibold text-primary hover:underline dark:text-accent-gold">
              Sign in
            </Link>{" "}
            to leave a rating and review.
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-500 dark:text-slate-400">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400">
          No reviews yet. Be the first to share your experience.
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StarRow value={r.rating} onChange={() => {}} disabled size="md" />
                  {r.mine && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-accent-gold">
                      You
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {r.reviewerDisplayName || "Customer"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                {r.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviewsSection;
