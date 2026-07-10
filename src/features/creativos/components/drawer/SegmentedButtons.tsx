import { cn } from '@/lib/utils';

export interface SegmentedButtonsProps {
  options: string[];
  value: string | string[];
  onChange: (option: string) => void;
  buttonClassName?: string;
  className?: string;
}

export function SegmentedButtons({ options, value, onChange, buttonClassName, className }: SegmentedButtonsProps) {
  const isActive = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === option;

  return (
    <div className={className}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-lg border font-medium disabled:opacity-60',
            buttonClassName,
            isActive(option)
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-slate-300 text-slate-600',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
