import { cn } from '@/lib/utils';

export interface SegmentedCountOption<T extends string> {
  value: T;
  label: string;
  count: number;
}

export interface SegmentedCountProps<T extends string> {
  options: SegmentedCountOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
}

/** Conmutador con contador a la derecha de cada opción, como los de Cobros. */
export function SegmentedCount<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedCountProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1"
    >
      {options.map((option) => {
        const activo = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={activo}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-colors',
              activo ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {option.label}
            <span
              className={cn(
                'rounded px-1 text-[11px] font-semibold',
                activo ? 'bg-slate-100 text-slate-500' : 'text-slate-400'
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
