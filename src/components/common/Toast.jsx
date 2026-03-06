import React from 'react';
import { useToast } from '../../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-6 py-4 rounded-xl shadow-lg flex items-center justify-between min-w-[300px] max-w-md animate-slide-in`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getIcon(toast.type)}</span>
            <span className="font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-slate-200 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;