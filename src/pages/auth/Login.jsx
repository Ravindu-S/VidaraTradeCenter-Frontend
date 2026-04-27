import React from "react";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your details to sign in to your account
          </p>
        </div>

        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-400 p-6">
          <div className="flex items-center gap-3 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-semibold">Member Login</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Vidara Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
