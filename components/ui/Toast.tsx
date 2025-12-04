'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const Icon = icons[toast.variant];

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg shadow-lg border',
                'animate-in slide-in-from-right',
                'bg-white',
                {
                    'border-green-500': toast.variant === 'success',
                    'border-red-500': toast.variant === 'error',
                    'border-yellow-500': toast.variant === 'warning',
                    'border-blue-500': toast.variant === 'info',
                }
            )}
        >
            <Icon
                className={cn('w-5 h-5 flex-shrink-0', {
                    'text-green-500': toast.variant === 'success',
                    'text-red-500': toast.variant === 'error',
                    'text-yellow-500': toast.variant === 'warning',
                    'text-blue-500': toast.variant === 'info',
                })}
            />
            <div className="flex-1">
                {toast.title && (
                    <p className="font-semibold text-[#333333] mb-1">{toast.title}</p>
                )}
                {toast.description && (
                    <p className="text-sm text-[#666666]">{toast.description}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition"
            >
                <X className="w-4 h-4 text-[#666666]" />
            </button>
        </div>
    );
}
