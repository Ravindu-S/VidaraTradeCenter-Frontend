import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false 
}) => {
  const baseStyles = 'bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800';
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:shadow-xl hover:shadow-primary/5 transition-all duration-300' : '';

  return (
    <div className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;