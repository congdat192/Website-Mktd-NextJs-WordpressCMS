import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#333333] mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg border transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[#E5E5E5] hover:border-[#228B22]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-[#666666]">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
