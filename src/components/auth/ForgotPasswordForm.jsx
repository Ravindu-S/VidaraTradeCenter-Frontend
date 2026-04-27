import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendForgotPasswordEmail } from "../../api/authApi";
import { useToast } from "../../context/ToastContext";

const ForgotPasswordForm = () => {
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please provide a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await sendForgotPasswordEmail(email);
      showSuccess("Password reset link sent! Check your email.");
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send reset email. Please try again.";
      showError(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
          <div className="mb-3">
            <svg className="h-12 w-12 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-green-600 font-semibold mb-2">Check your email!</p>
          <p className="text-sm text-green-600 mb-4">
            We've sent a password reset link to <strong>{email}</strong>. 
            The link will expire in 1 hour.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-green-600 hover:text-green-700 font-medium underline"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General Error */}
      {errors.general && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors outline-none ${
              errors.email
                ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
            disabled={loading}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-lg font-medium transition-all ${
          loading
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          "Send Reset Link"
        )}
      </button>

      {/* Back to Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline transition-colors"
          >
            Back to login
          </Link>
        </p>
      </div>

      {/* Help Text */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-xs text-blue-600">
          💡 <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
