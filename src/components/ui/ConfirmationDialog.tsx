import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'primary';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading: externalLoading = false
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch {
      // Handled by caller
    } finally {
      setInternalLoading(false);
    }
  };

  const variantIcons = {
    danger: <AlertCircle className="w-6 h-6 text-rose-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    info: <Info className="w-6 h-6 text-cyan-400" />,
    primary: <CheckCircle2 className="w-6 h-6 text-indigo-400" />
  };

  const buttonVariants = {
    danger: 'danger' as const,
    warning: 'secondary' as const,
    info: 'outline' as const,
    primary: 'primary' as const
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center p-2 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
          {variantIcons[variant]}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm">{description}</p>
        </div>

        <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-white/10">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            size="md"
            onClick={handleConfirm}
            loading={isLoading}
            className="flex-1 cursor-pointer"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
