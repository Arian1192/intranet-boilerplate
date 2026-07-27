import type { IncidenciaEstado } from '../data/incidencias';

const ESTADO_ACCENT: Record<IncidenciaEstado, string> = {
  nueva: 'bg-rose-100 text-rose-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-slate-100 text-slate-500',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

export interface IncidenciaStatFilterProps {
  estado: IncidenciaEstado;
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
}

export function IncidenciaStatFilter({ estado, label, count, selected, onToggle }: IncidenciaStatFilterProps) {
  const hasCount = count > 0;
  const cardClass = selected
    ? 'border-slate-800 bg-white shadow-sm'
    : hasCount
      ? 'border-slate-200 bg-white hover:border-slate-300'
      : 'border-slate-100 bg-slate-50/60';
  const badgeClass = hasCount ? ESTADO_ACCENT[estado] : 'bg-transparent text-slate-300';
  const countClass = hasCount ? 'text-slate-900' : 'text-slate-300';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`min-w-[92px] rounded-lg border px-2.5 py-1.5 text-left transition ${cardClass}`}
    >
      <span
        className={`block truncate rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}
      >
        {label}
      </span>
      <span className={`block text-lg font-semibold ${countClass}`}>{count}</span>
    </button>
  );
}
