'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children,
  size = 'md' 
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content 
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-white rounded-2xl shadow-xl',
            'w-full p-6',
            'animate-in fade-in zoom-in-95',
            sizeClasses[size]
          )}
        >
          {title && (
            <Dialog.Title className="text-xl font-bold text-[#333333] mb-2">
              {title}
            </Dialog.Title>
          )}
          
          {description && (
            <Dialog.Description className="text-sm text-[#666666] mb-4">
              {description}
            </Dialog.Description>
          )}

          <div className="mt-4">
            {children}
          </div>

          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F5F5F5] transition">
            <X className="w-5 h-5 text-[#666666]" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
