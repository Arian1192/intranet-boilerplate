const TONE_LABEL: Record<'slate' | 'emerald', string> = {
  slate: 'text-slate-600',
  emerald: 'text-emerald-600',
};

export interface StageBoxProps {
  label: string;
  count: number;
  amount?: string;
  tone: 'slate' | 'emerald';
  selected?: boolean;
  onClick?: () => void;
}

export function StageBox({ label, count, amount, tone, selected, onClick }: StageBoxProps) {
  const has = count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`rounded-lg border px-3 py-2 text-center transition ${
        selected ? 'border-slate-800' : has && tone === 'emerald' ? 'border-emerald-300' : 'border-slate-200'
      } ${has ? 'bg-white' : 'bg-slate-50'}`}
    >
      <div className={`text-[10px] font-semibold uppercase tracking-wide ${has ? TONE_LABEL[tone] : 'text-slate-300'}`}>
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-lg font-bold ${has ? 'text-slate-800' : 'text-slate-300'}`}>{count}</span>
        {has && amount && <span className="text-xs text-slate-500">{amount}</span>}
      </div>
    </button>
  );
}
