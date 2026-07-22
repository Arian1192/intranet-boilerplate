export interface CalendarLegendProps {
  approvedOnly: boolean;
  onApprovedOnly: (v: boolean) => void;
}

const items = [
  { label: 'Vacaciones', color: 'bg-purple-500' },
  { label: 'Teletrabajo', color: 'bg-blue-500' },
  { label: 'Baja', color: 'bg-red-500' },
  { label: 'Ausencia', color: 'bg-orange-500' },
  { label: 'Festivo / finde', color: 'bg-slate-200' },
];

export function CalendarLegend({ approvedOnly, onApprovedOnly }: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="inline-flex items-center gap-2 text-slate-700">
        <input
          type="checkbox"
          checked={approvedOnly}
          onChange={(e) => onApprovedOnly(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Solo aprobadas
      </label>
      {items.map((item) => (
        <div key={item.label} className="inline-flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${item.color}`} />
          <span className="text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
