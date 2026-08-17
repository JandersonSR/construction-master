import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  action?: ReactNode;
  icon?: string;
}

export function EmptyState({ title, action, icon = '📋' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="text-slate-600 dark:text-slate-300">{title}</p>
      {action}
    </div>
  );
}
