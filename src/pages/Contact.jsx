import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { submitContactInquiry } from "../api/contactApi";

/** Same inbox used for order confirmations — Contact form delivers here. */
const SUPPORT_INBOX = "support.vidaratradecenter@gmail.com";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "general",
  message: "",
};

const subjectOptions = [
  { value: "general", label: "General inquiry" },
  { value: "order", label: "Order & delivery" },
  { value: "returns", label: "Returns & refunds" },
  { value: "product", label: "Product question" },
  { value: "partnership", label: "Partnership / wholesale" },
  { value: "other", label: "Other" },
];

const contactCards = [
  {
    icon: "mail",
    title: "Email",
    lines: [SUPPORT_INBOX],
    href: `mailto:${SUPPORT_INBOX}`,
    action: "Send email",
  },
  {
    icon: "call",
    title: "Phone",
    lines: ["+94 74 000 0000", "Mon–Sat, 9:00–18:00 IST"],
    href: "tel:+94740000000",
    action: "Call us",
  },
  {
    icon: "location_on",
    title: "Visit",
    lines: ["Vidara Trade Center", "Colombo, Sri Lanka"],
    href: null,
    action: null,
  },
];

const Contact = () => {
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageSent(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showError("Please fill in your name, email, and message.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) {
      showError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await submitContactInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      });
      setMessageSent(true);
      setForm(initialForm);
      showSuccess(
        `Message sent to ${SUPPORT_INBOX}. We received it and will reply as soon as we can.`
      );
    } catch (err) {
      const payload = err.response?.data;
      const fieldErrors = payload?.data && typeof payload.data === "object" ? payload.data : null;
      const firstField =
        fieldErrors && Object.keys(fieldErrors).length > 0
          ? Object.values(fieldErrors)[0]
          : null;
      const msg =
        firstField ||
        payload?.message ||
        "Could not send your message. Please try again or email us directly.";
      showError(typeof msg === "string" ? msg : "Could not send your message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12 lg:py-14">
        <div className="mb-10 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-gold">
            <span className="material-symbols-outlined text-xs">support_agent</span>
            We&apos;re here to help
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Contact us
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Questions about an order, a product, or anything else? Send us a
            message — we read every inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 md:p-8"
              noValidate
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Messages are delivered to{" "}
                <a
                  href={`mailto:${SUPPORT_INBOX}`}
                  className="font-medium text-primary underline-offset-2 hover:underline dark:text-accent-gold"
                >
                  {SUPPORT_INBOX}
                </a>{" "}
                (the same address we use for order notifications). We&apos;ll reply from there.
              </p>

              {messageSent && (
                <div
                  className="mt-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                  role="status"
                >
                  <span className="material-symbols-outlined shrink-0 text-emerald-600 dark:text-emerald-400">
                    mark_email_read
                  </span>
                  <div className="text-sm leading-relaxed">
                    <p className="font-semibold">Your message was sent</p>
                    <p className="mt-1 text-emerald-800 dark:text-emerald-200/90">
                      It was delivered to{" "}
                      <strong className="font-mono text-[0.9em]">{SUPPORT_INBOX}</strong>. Check
                      your inbox later for our reply — we may also reach you at the email you
                      entered above.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="Your name"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="+94 XX XXX XXXX"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Topic
                  </span>
                  <div className="relative">
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                      <span className="material-symbols-outlined text-xl">expand_more</span>
                    </span>
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Message <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="How can we help?"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send message"}
                </button>
                <Link
                  to="/products"
                  className="text-center text-sm font-semibold text-primary hover:underline dark:text-accent-gold"
                >
                  Continue shopping
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-primary p-6 text-white dark:border-slate-800">
              <h3 className="text-lg font-bold">Prefer another channel?</h3>
              <p className="mt-2 text-sm text-slate-300">
                For order updates, check{" "}
                <Link
                  to="/orders"
                  className="font-semibold text-accent-gold underline-offset-2 hover:underline"
                >
                  My orders
                </Link>{" "}
                when signed in — you&apos;ll see tracking there too.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-white">
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.title}
                    </p>
                    {card.lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-sm font-medium text-slate-900 dark:text-white"
                      >
                        {line}
                      </p>
                    ))}
                    {card.href && card.action && (
                      <a
                        href={card.href}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline dark:text-accent-gold"
                      >
                        {card.action}
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
              <div
                className="flex h-48 items-center justify-center bg-slate-200 dark:bg-slate-800"
                role="img"
                aria-label="Map placeholder"
              >
                <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-4xl">map</span>
                  <span className="text-sm font-medium">Map embed can go here later</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
