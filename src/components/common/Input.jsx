import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-white dark:border-slate-700 transition-all ${
          error ? 'border-error focus:ring-error' : 'border-slate-300 dark:border-slate-700'
        } ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;