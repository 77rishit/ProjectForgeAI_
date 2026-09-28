import React from 'react';
import { Modal, ModalProps } from './Modal';

export interface DialogProps extends ModalProps {}

export const Dialog: React.FC<DialogProps> = (props) => {
  return <Modal {...props} />;
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`pb-4 border-b border-white/10 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h2 className={`text-lg sm:text-xl font-bold text-white tracking-tight ${className}`} {...props}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-white/50 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-4 border-t border-white/10 ${className}`} {...props}>
    {children}
  </div>
);
