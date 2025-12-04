import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
            <Link
                href="/"
                className="flex items-center gap-1 text-[#666666] hover:text-[#228B22] transition"
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-[#666666]" />
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-[#666666] hover:text-[#228B22] transition"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={cn(
                                isLast ? 'text-[#333333] font-medium' : 'text-[#666666]'
                            )}>
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
