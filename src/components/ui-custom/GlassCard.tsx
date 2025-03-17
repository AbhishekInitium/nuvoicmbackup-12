
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'subtle' | 'outlined';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  interactive = false,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    default: 'bg-white bg-opacity-90 shadow-glass hover:shadow-glass-hover',
    subtle: 'bg-app-gray-50 bg-opacity-80 shadow-glass-sm hover:shadow-glass',
    outlined: 'bg-white bg-opacity-60 border border-app-gray-200 hover:border-app-gray-300'
  };

  return (
    <div
      className={cn(
        'backdrop-blur-md rounded-2xl transition-all duration-450 ease-apple',
        variantClasses[variant],
        interactive && 'cursor-pointer transform hover:-translate-y-0.5',
        isHovered && interactive && 'scale-[1.01]',
        className
      )}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default GlassCard;
