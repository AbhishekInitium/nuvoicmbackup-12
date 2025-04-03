
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading = false,
  ...props
}) => {
  const variantClasses = {
    primary: 'action-button-primary',
    secondary: 'action-button-secondary',
    outline: 'action-button-outline',
    ghost: 'text-app-gray-700 hover:bg-app-gray-100',
    danger: 'bg-app-red text-white hover:bg-opacity-90 focus:ring-app-red/40'
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'action-button',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-60 cursor-not-allowed transform-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
