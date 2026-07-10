import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'blue'
    | 'amber'
    | 'fuchsia'
    | 'emerald'
    | 'sky'
    | 'indigo'
    | 'pink'
    | 'rose';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        {
          'bg-blue-50 text-blue-700': variant === 'info',
          'bg-green-50 text-green-700': variant === 'success',
          'bg-yellow-50 text-yellow-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
          'bg-slate-100 text-slate-600': variant === 'neutral',
          'bg-blue-100 text-blue-700': variant === 'blue',
          'bg-amber-100 text-amber-700': variant === 'amber',
          'bg-fuchsia-100 text-fuchsia-700': variant === 'fuchsia',
          'bg-emerald-100 text-emerald-700': variant === 'emerald',
          'bg-sky-100 text-sky-700': variant === 'sky',
          'bg-indigo-100 text-indigo-700': variant === 'indigo',
          'bg-pink-50 text-pink-600': variant === 'pink',
          'bg-rose-100 text-rose-700': variant === 'rose',
        },
        className
      )}
      {...props}
    />
  );
}
