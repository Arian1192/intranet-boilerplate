const TONE_LABEL: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'text-slate-600',
  slate: 'text-slate-600',
  amber: 'text-amber-600',
};

export interface StatusBoxProps {
  label: string;
  count: number;
  tone: 'plain' | 'slate' | 'amber';
  selected?: boolean;
  onClick?: () => void;
}

export function StatusBox({ label, count, tone, selected, onClick }: StatusBoxProps) {
  const has = count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`min-w-[92px] rounded-lg border px-3 py-2 text-center transition ${
        selected ? 'border-slate-800' : 'border-slate-200'
      } ${has ? 'bg-white' : 'bg-slate-50'}`}
    >
      <div className={`text-[10px] font-semibold uppercase tracking-wide ${has ? TONE_LABEL[tone] : 'text-slate-300'}`}>
        {label}
      </div>
      <div className={`text-lg font-bold ${has ? 'text-slate-800' : 'text-slate-300'}`}>{count}</div>
    </button>
  );
}
