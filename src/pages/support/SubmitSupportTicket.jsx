import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitSupportTicket } from "../../api/supportApi";
import { useToast } from "../../context/ToastContext";

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "ORDER", label: "Order Issue" },
  { value: "PAYMENT", label: "Payment Issue" },
  { value: "ACCOUNT", label: "Account Issue" },
  { value: "OTHER", label: "Other" },
];

const SubmitSupportTicket = () => {
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitSupportTicket({
        subject: formData.subject.trim(),
        category: formData.category,
        description: formData.description.trim(),
      });

      // Clear the form
      setFormData({ subject: "", category: "", description: "" });
      setErrors({});
      setSubmitted(true);
      showSuccess("Your support ticket has been submitted successfully.");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewTicket = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Submit Support Ticket</span>
        </nav>

        {/* Success State */}
        {submitted ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="material-symbols-outlined text-3xl text-green-600">
                check_circle
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Ticket Submitted Successfully!
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Your support ticket has been submitted successfully. Our team will
              review it and get back to you shortly.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleNewTicket}
                className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Submit Another Ticket
              </button>
              <Link
                to="/"
                className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <span className="material-symbols-outlined text-xl text-indigo-600">
                    support_agent
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Submit Support Ticket
                  </h1>
                  <p className="text-sm text-gray-500">
                    Need help? Fill out the form below and we'll get back to you.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your issue"
                  className={`w-full rounded-lg border ${
                    errors.subject ? "border-red-300" : "border-gray-200"
                  } bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.category ? "border-red-300" : "border-gray-200"
                  } bg-gray-50 py-3 px-4 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please describe your issue in detail..."
                  className={`w-full rounded-lg border ${
                    errors.description ? "border-red-300" : "border-gray-200"
                  } bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-vertical`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        send
                      </span>
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitSupportTicket;
