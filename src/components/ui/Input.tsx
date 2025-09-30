'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    helperText,
    icon: Icon,
    containerClassName = '',
    className = '',
    ...props
  },
  ref
) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30
    focus:border-ios-blue focus:outline-none focus:ring-2 focus:ring-ios-blue/20
    placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200
    ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
    ${Icon ? 'pl-12' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';