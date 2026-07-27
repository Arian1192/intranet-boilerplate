const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export interface MonthNavProps {
  year: number;
  month: number; // 0-indexed
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNav({ year, month, onPrev, onNext }: MonthNavProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Mes anterior"
        className="rounded-lg px-2 py-1 text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        ‹
      </button>
      <h2 className="text-base font-semibold text-slate-800">
        {MESES[month]} {year}
      </h2>
      <button
        type="button"
        onClick={onNext}
        aria-label="Mes siguiente"
        className="rounded-lg px-2 py-1 text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        ›
      </button>
    </div>
  );
}
