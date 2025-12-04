import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                    'bg-[#228B22]/10 text-[#228B22]': variant === 'default',
                    'bg-green-100 text-green-800': variant === 'success',
                    'bg-yellow-100 text-yellow-800': variant === 'warning',
                    'bg-red-100 text-red-800': variant === 'error',
                    'bg-blue-100 text-blue-800': variant === 'info',
                },
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
