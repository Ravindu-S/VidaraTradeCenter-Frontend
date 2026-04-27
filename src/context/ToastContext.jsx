import React, { createContext, useContext, useMemo } from "react";

const ToastContext = createContext();

const noop = () => {};

/**
 * Toast UI is disabled — showSuccess/showError are no-ops so call sites stay unchanged
 * without rendering corner cards or updating state.
 */
export const ToastProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      toasts: [],
      showToast: noop,
      showSuccess: noop,
      showError: noop,
      showInfo: noop,
      showWarning: noop,
      removeToast: noop,
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
