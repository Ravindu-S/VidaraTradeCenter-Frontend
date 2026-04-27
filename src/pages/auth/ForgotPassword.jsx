import React from "react";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 p-6">
          <div className="flex items-center gap-3 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="text-sm font-semibold">Secure Password Reset</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <ForgotPasswordForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Vidara Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
