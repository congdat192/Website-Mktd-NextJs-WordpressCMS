'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    baseUrl?: string; // For URL-based pagination
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    baseUrl,
    className
}: PaginationProps) {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        // Show pages around current
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange?.(page);
    };

    const PageButton = ({ page, children }: { page: number; children: React.ReactNode }) => {
        const isActive = page === currentPage;

        if (baseUrl) {
            return (
                <Link
                    href={`${baseUrl}?page=${page}`}
                    className={cn(
                        'px-4 py-2 rounded-lg font-medium transition',
                        isActive
                            ? 'bg-[#228B22] text-white'
                            : 'border border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#333333]'
                    )}
                >
                    {children}
                </Link>
            );
        }

        return (
            <button
                onClick={() => handlePageChange(page)}
                className={cn(
                    'px-4 py-2 rounded-lg font-medium transition',
                    isActive
                        ? 'bg-[#228B22] text-white'
                        : 'border border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#333333]'
                )}
            >
                {children}
            </button>
        );
    };

    if (totalPages <= 1) return null;

    return (
        <nav className={cn('flex items-center justify-center gap-2', className)}>
            {/* Previous Button */}
            {baseUrl ? (
                <Link
                    href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
                    className={cn(
                        'p-2 rounded-lg border border-[#E5E5E5] transition',
                        currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#F5F5F5]'
                    )}
                    aria-label="Trang trước"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
            ) : (
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        'p-2 rounded-lg border border-[#E5E5E5] transition',
                        currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#F5F5F5]'
                    )}
                    aria-label="Trang trước"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {/* Page Numbers */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-[#666666]">
                            ...
                        </span>
                    );
                }

                return (
                    <PageButton key={page} page={page as number}>
                        {page}
                    </PageButton>
                );
            })}

            {/* Next Button */}
            {baseUrl ? (
                <Link
                    href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}
                    className={cn(
                        'p-2 rounded-lg border border-[#E5E5E5] transition',
                        currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#F5F5F5]'
                    )}
                    aria-label="Trang sau"
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            ) : (
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        'p-2 rounded-lg border border-[#E5E5E5] transition',
                        currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#F5F5F5]'
                    )}
                    aria-label="Trang sau"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </nav>
    );
}
