export interface ChartPlaceholderProps {
  title: string;
}

export function ChartPlaceholder({ title }: ChartPlaceholderProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-medium text-slate-700">{title}</p>
      <div className="flex h-40 items-end gap-2">
        {[40, 70, 50, 90, 60, 80, 45, 75, 55, 85].map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-brand-200"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
