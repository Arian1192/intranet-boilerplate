import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  fillClassName?: string;
}

export function ProgressBar({ value, max, className, fillClassName }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <div className={cn('h-full rounded-full', fillClassName ?? 'bg-emerald-500')} style={{ width: `${percent}%` }} />
    </div>
  );
}
