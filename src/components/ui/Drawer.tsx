import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  children,
  footer,
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    right: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full'
    },
    left: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full'
    },
    bottom: {
      sm: 'max-h-[30vh]',
      md: 'max-h-[50vh]',
      lg: 'max-h-[70vh]',
      xl: 'max-h-[85vh]',
      full: 'max-h-screen'
    }
  };

  const motionVariants = {
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
      exit: { x: '100%' }
    },
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
      exit: { x: '-100%' }
    },
    bottom: {
      hidden: { y: '100%' },
      visible: { y: 0 },
      exit: { y: '100%' }
    }
  };

  const positionClasses = {
    right: 'inset-y-0 right-0 h-full border-l',
    left: 'inset-y-0 left-0 h-full border-r',
    bottom: 'inset-x-0 bottom-0 w-full border-t rounded-t-3xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <motion.div
            variants={motionVariants[position]}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={`fixed ${positionClasses[position]} ${
              position === 'bottom' ? sizeClasses.bottom[size] : sizeClasses.right[size]
            } w-full border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-2xl shadow-2xl flex flex-col z-50 text-[var(--text-main)] ${className}`}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] shrink-0">
                <div className="space-y-0.5">
                  {title && <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">{title}</h2>}
                  {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">{children}</div>

            {/* Footer */}
            {footer && <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 shrink-0">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
