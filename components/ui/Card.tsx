import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl',
                {
                    // Variants
                    'shadow-sm': variant === 'default',
                    'border border-[#E5E5E5]': variant === 'bordered',
                    'shadow-lg': variant === 'elevated',

                    // Padding
                    'p-0': padding === 'none',
                    'p-4': padding === 'sm',
                    'p-6': padding === 'md',
                    'p-8': padding === 'lg',
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
    return (
        <h3 className={cn('text-xl font-bold text-[#333333]', className)} {...props}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-[#666666]', className)} {...props}>
            {children}
        </p>
    );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-[#E5E5E5]', className)} {...props}>
            {children}
        </div>
    );
}
