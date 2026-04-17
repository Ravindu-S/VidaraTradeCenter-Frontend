import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join the Vidara community today
          </p>
        </div>

        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-400 p-6">
          <div className="flex items-center gap-3 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-semibold">New Member Registration</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Vidara Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
