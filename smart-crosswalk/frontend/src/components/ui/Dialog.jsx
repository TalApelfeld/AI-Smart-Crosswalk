import { useEffect } from 'react';
import { cn } from '../../utils';

export function Dialog({ 
  open, 
  onClose, 
  children, 
  className,
  maxWidth = 'max-w-lg'
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div 
        className={cn(
          'relative bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto',
          maxWidth,
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-b border-surface-200', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }) {
  return (
    <h2 className={cn('text-xl font-semibold text-surface-900', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-surface-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function DialogContent({ children, className }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-t border-surface-200 flex justify-end gap-3', className)}>
      {children}
    </div>
  );
}
