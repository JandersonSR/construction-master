interface ProgressBarProps {
  percent: number;
  label?: string;
  colorClassName?: string;
}

export function ProgressBar({ percent, label, colorClassName }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div>
      {label ? (
        <div className="mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>{label}</span>
          <span>{clamped.toFixed(0)}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className={`h-full rounded-full ${colorClassName ?? 'bg-brand-600'}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
