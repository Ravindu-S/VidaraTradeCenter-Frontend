import React from "react";

const Loader = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    default: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-slate-300 border-t-primary dark:border-slate-600 dark:border-t-white`}
        style={{ borderWidth: size === "small" ? "2px" : "3px" }}
      />
    </div>
  );
};

export default Loader;