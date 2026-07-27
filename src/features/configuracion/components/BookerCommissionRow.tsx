export interface BookerCommissionRowProps {
  bookerName: string;
  percent: number;
  globalPercent: number;
  onChange: (percent: number) => void;
}

export function BookerCommissionRow({ bookerName, percent, globalPercent, onChange }: BookerCommissionRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 px-2 py-3 text-sm last:border-b-0">
      <span className="text-slate-700">{bookerName}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={percent}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-right text-sm"
        />
        <span className="text-slate-500">%</span>
        <span className="text-slate-400">(global {globalPercent}%)</span>
      </span>
    </div>
  );
}
