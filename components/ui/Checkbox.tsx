'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="flex items-start gap-2">
                <input
                    ref={ref}
                    type="checkbox"
                    className={cn(
                        'w-5 h-5 rounded border-2 border-[#E5E5E5] text-[#228B22]',
                        'focus:ring-2 focus:ring-[#228B22] focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'cursor-pointer',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label className={cn(
                        'text-sm text-[#333333] cursor-pointer select-none',
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="flex items-start gap-2">
                <input
                    ref={ref}
                    type="radio"
                    className={cn(
                        'w-5 h-5 border-2 border-[#E5E5E5] text-[#228B22]',
                        'focus:ring-2 focus:ring-[#228B22] focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'cursor-pointer',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label className={cn(
                        'text-sm text-[#333333] cursor-pointer select-none',
                        props.disabled && 'opacity-50 cursor-not-allowed'
                    )}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Radio.displayName = 'Radio';
