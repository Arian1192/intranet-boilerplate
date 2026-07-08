import { cn } from '@/lib/utils';
import type { ShowStatus } from '@/types';

export interface StatusBadgeProps {
  status: ShowStatus;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<ShowStatus, string> = {
  tentative: 'bg-slate-500',
  offer: 'bg-sky-400',
  confirmed: 'bg-sky-500',
  contract: 'bg-blue-500',
  'pending-payment': 'bg-rose-500',
  'pending-settlement': 'bg-indigo-500',
  done: 'bg-emerald-500',
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2 py-1 text-xs font-medium text-white',
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
