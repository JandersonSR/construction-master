import type { ReactNode } from 'react';
import { EstimateBadge } from '../components/ui/EstimateBadge';

export function CalculatorCard({
  title,
  children,
  result,
  error,
}: {
  title: string;
  children: ReactNode;
  result?: ReactNode;
  error?: string;
}) {
  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        <EstimateBadge />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : result ? (
        <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
          {result}
        </div>
      ) : null}
    </section>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      {label}: <strong>{value}</strong>
    </p>
  );
}
