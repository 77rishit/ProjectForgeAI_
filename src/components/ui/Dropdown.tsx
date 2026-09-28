import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  dividerAfter?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  children,
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 shadow-2xl z-50 backdrop-blur-2xl text-[var(--text-main)] ${className}`}
          >
            {items ? (
              <div className="py-1">
                {items.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <button
                      type="button"
                      disabled={item.disabled}
                      onClick={() => {
                        if (!item.disabled && item.onClick) {
                          item.onClick();
                          setIsOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        item.disabled
                          ? 'opacity-40 cursor-not-allowed text-[var(--text-dim)]'
                          : item.danger
                          ? 'text-rose-400 hover:bg-rose-500/10'
                          : 'text-[var(--text-main)] hover:bg-white/10 light:hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {item.icon && <span className="w-4 h-4 shrink-0 text-[var(--text-dim)]">{item.icon}</span>}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge}
                    </button>
                    {item.dividerAfter && <div className="my-1 border-t border-[var(--border-subtle)]" />}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div onClick={() => setIsOpen(false)}>{children}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
