import { cn } from '@/lib/utils';

export interface UnderlineTabsOption<T extends string> {
  label: string;
  value: T;
}

export interface UnderlineTabsProps<T extends string> {
  options: UnderlineTabsOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function UnderlineTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: UnderlineTabsProps<T>) {
  return (
    <div className={cn('flex gap-6 border-b border-slate-200', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            '-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
