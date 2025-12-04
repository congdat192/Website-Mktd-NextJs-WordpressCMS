import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        isLoading,
        fullWidth,
        className,
        children,
        disabled,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-colors rounded-lg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    {
                        // Variants
                        'bg-[#228B22] text-white hover:bg-[#1a6b1a]': variant === 'primary',
                        'bg-[#333333] text-white hover:bg-[#333333]/90': variant === 'secondary',
                        'border-2 border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white': variant === 'outline',
                        'text-[#228B22] hover:bg-[#228B22]/10': variant === 'ghost',
                        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',

                        // Sizes
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',

                        // Full width
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang xử lý...
                    </>
                ) : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
