import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`space-y-4 mb-6 sm:mb-8 ${className}`}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]" aria-label="Breadcrumb">
          <Link to="/dashboard" className="hover:text-[var(--text-main)] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-[var(--text-dim)] opacity-50 shrink-0" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-[var(--text-main)] transition-colors truncate max-w-[150px] sm:max-w-xs">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[var(--text-main)] font-medium truncate max-w-[180px] sm:max-w-xs">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">{title}</h1>
            {badge && <div className="inline-flex items-center shrink-0">{badge}</div>}
          </div>
          {subtitle && <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">{actions}</div>}
      </div>

      {/* Optional Filters or Search bar slot */}
      {children && <div className="pt-2">{children}</div>}
    </motion.div>
  );
};
