import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-blue-50 text-blue-700': variant === 'info',
          'bg-green-50 text-green-700': variant === 'success',
          'bg-yellow-50 text-yellow-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
          'bg-slate-100 text-slate-600': variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  );
}
