'use client';

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-8 py-3 font-mono text-lg uppercase tracking-wider transition-all',
          'before:absolute before:inset-0 before:transition-all',
          variant === 'primary' 
            ? 'bg-orange-600 text-cream-100 hover:bg-orange-700 before:border-4 before:border-orange-700 hover:before:-translate-x-2 hover:before:-translate-y-2'
            : 'bg-teal-600 text-cream-100 hover:bg-teal-700 before:border-4 before:border-teal-700 hover:before:-translate-x-2 hover:before:-translate-y-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

RetroButton.displayName = 'RetroButton';

export default RetroButton;