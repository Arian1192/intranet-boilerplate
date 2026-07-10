import { cn } from '@/lib/utils';
import { FILTERS, type CreativosFilter } from '../data/creativos';

export interface FilterChipsProps {
  active: CreativosFilter;
  onChange: (filter: CreativosFilter) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            filter === active
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
