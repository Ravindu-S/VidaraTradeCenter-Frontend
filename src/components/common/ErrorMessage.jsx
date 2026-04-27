import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-error rounded-2xl p-8 text-center">
      <div className="text-error text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-error mb-3">Oops! Something went wrong</h3>
      <p className="text-slate-700 dark:text-slate-300 mb-6">{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-error text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all font-bold"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;