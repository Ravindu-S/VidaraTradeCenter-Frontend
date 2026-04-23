import React from "react";
import { Link } from "react-router-dom";

const InfoPage = ({
  badge,
  title,
  description,
  sections,
  updatedLabel = "Updated April 2026",
  showHelpButton = true,
}) => {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-10 lg:px-12 lg:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:bg-primary/20 dark:text-white">
            <span className="material-symbols-outlined text-xs">info</span>
            {badge}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {updatedLabel}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 lg:text-base">
          {description}
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {section.content}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {showHelpButton && (
            <Link
              to="/support/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Need More Help?
            </Link>
          )}
          <Link
            to="/products"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InfoPage;
