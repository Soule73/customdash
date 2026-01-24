import { type ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  subtitle?: string;
  className?: string;
}

/**
 * PageHeader component for displaying page titles with optional actions
 */
export function PageHeader({ title, actions, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-6 flex flex-col justify-between md:flex-row md:items-center ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
}
