function parseDateBadge(date: string): { day: string; month: string } {
  const [day = '', month = ''] = date.trim().split(/\s+/);
  return { day, month: month.toUpperCase() };
}

export interface DateBadgeProps {
  date: string;
}

export function DateBadge({ date }: DateBadgeProps) {
  const { day, month } = parseDateBadge(date);
  return (
    <span className="flex w-12 shrink-0 flex-col items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
      <span className="w-full bg-slate-50 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {month}
      </span>
      <span className="py-1 text-lg font-bold leading-none text-slate-800">{day}</span>
    </span>
  );
}
