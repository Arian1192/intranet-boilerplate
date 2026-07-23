import { Button } from '@/components/ui';
import { formatHolidayDate, type Holiday, type HolidayScope } from '../data/festivos';

const SCOPE_LABEL: Record<HolidayScope, string> = {
  espana: 'España',
  catalunya: 'Catalunya',
  barcelona: 'Barcelona',
};

const SCOPE_CHIP: Record<HolidayScope, string> = {
  espana: 'bg-slate-100 text-slate-500',
  catalunya: 'bg-amber-100 text-amber-700',
  barcelona: 'bg-sky-100 text-sky-700',
};

export interface HolidayRowProps {
  holiday: Holiday;
  onRemove: () => void;
}

export function HolidayRow({ holiday, onRemove }: HolidayRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-3 text-sm last:border-b-0">
      <span className="w-24 shrink-0 text-slate-400">{formatHolidayDate(holiday.date)}</span>
      <span className="flex-1 font-semibold text-slate-800">{holiday.name}</span>
      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${SCOPE_CHIP[holiday.scope]}`}>
        {SCOPE_LABEL[holiday.scope]}
      </span>
      <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${holiday.name}`} onClick={onRemove}>
        ✕
      </Button>
    </div>
  );
}
