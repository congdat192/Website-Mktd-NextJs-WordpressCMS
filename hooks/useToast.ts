import { useToast as useToastUI } from '@/components/ui/Toast';

interface ToastOptions {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
    duration?: number;
}

export function useToast() {
    const { addToast } = useToastUI();

    const showToast = ({ type, message, title, duration }: ToastOptions) => {
        addToast({
            variant: type,
            description: message,
            title,
            duration,
        });
    };

    return { showToast };
}
