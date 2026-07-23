const CHIP: Record<'red' | 'sky' | 'emerald' | 'neutral', string> = {
  red: 'bg-red-100 text-red-700',
  sky: 'bg-sky-100 text-sky-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  neutral: 'text-slate-400',
};

export interface IncidentCountPillProps {
  label: string;
  count: number;
  tone: 'red' | 'sky' | 'emerald' | 'neutral';
}

export function IncidentCountPill({ label, count, tone }: IncidentCountPillProps) {
  const disabled = count === 0;
  return (
    <div className={`rounded-xl border p-3 ${disabled ? 'border-slate-100 opacity-60' : 'border-slate-200 bg-white'}`}>
      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CHIP[tone]}`}>
        {label}
      </span>
      <p className={`mt-1 text-xl font-bold ${disabled ? 'text-slate-300' : 'text-slate-800'}`}>{count}</p>
    </div>
  );
}
