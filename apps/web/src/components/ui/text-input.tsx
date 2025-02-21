import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  validateOnInvalid?: boolean;
  validateOnInput?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, validateOnInvalid = false, validateOnInput = false, required, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-sub-text rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition',
          className
        )}
        onInvalid={validateOnInvalid ? (e) => (e.target as HTMLInputElement).setCustomValidity('Please fill out this field.') : undefined}
        onInput={validateOnInput ? (e) => (e.target as HTMLInputElement).setCustomValidity('') : undefined}
        required={required}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
