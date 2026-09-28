import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = '',
  striped = false,
  hoverable = true,
  compact = false,
  ...props
}) => {
  return (
    <div className="relative w-full overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
      <table
        className={`w-full text-left text-xs text-[var(--text-main)] border-collapse ${
          compact ? 'text-xs' : 'text-xs sm:text-sm'
        } ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <thead className={`border-b border-[var(--border-subtle)] bg-white/[0.01] light:bg-slate-50 text-[var(--text-dim)] uppercase tracking-wider text-[11px] font-semibold ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tbody className={`divide-y divide-[var(--border-subtle)] ${className}`} {...props}>
    {children}
  </tbody>
);

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  selected = false,
  className = '',
  ...props
}) => (
  <tr
    className={`transition-colors hover:bg-white/[0.02] light:hover:bg-slate-50 ${
      selected ? 'bg-indigo-500/10' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  className = '',
  ...props
}) => (
  <th
    className={`px-4 py-3 text-left font-semibold select-none ${
      sortable ? 'cursor-pointer hover:text-[var(--text-main)] transition-colors' : ''
    } ${className}`}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-1.5">
      <span>{children}</span>
      {sortable && (
        <span className="text-[var(--text-dim)]">
          {sortDirection === 'asc' ? (
            <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
          ) : sortDirection === 'desc' ? (
            <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5" />
          )}
        </span>
      )}
    </div>
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td className={`px-4 py-3.5 align-middle ${className}`} {...props}>
    {children}
  </td>
);

export const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <caption className={`p-3 text-xs text-[var(--text-dim)] italic ${className}`} {...props}>
    {children}
  </caption>
);
