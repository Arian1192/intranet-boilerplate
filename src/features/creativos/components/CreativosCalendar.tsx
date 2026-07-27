import { useMemo, useState } from 'react';
import { EuphoricCalendar } from '@/features/euphoric/components/EuphoricCalendar';
import { cn } from '@/lib/utils';
import type { CreativePiece } from '../data/seed';
import { MONTHS_ES, deadlineToIso } from '../data/creativos';

export interface CreativosCalendarProps {
  /** Creatividades ya filtradas por la página: los filtros afectan también al calendario. */
  pieces: CreativePiece[];
  today: Date;
}

/**
 * Vista Calendario del live (D6): rejilla mensual con cada creatividad en el día de su
 * deadline. Reutiliza `EuphoricCalendar` — la misma rejilla Lun–Dom, con dos extensiones
 * aditivas suyas: cabecera `← → Julio 2026 Hoy` (`headerLayout="leading"`) y 6 semanas fijas.
 */
export function CreativosCalendar({ pieces, today }: CreativosCalendarProps) {
  const initial = { year: today.getFullYear(), month: today.getMonth() };
  const [cursor, setCursor] = useState(initial);

  const byDay = useMemo(() => {
    const map: Record<string, CreativePiece[]> = {};
    pieces.forEach((piece) => {
      const iso = deadlineToIso(piece.deadline);
      if (!iso) return;
      if (!map[iso]) map[iso] = [];
      map[iso].push(piece);
    });
    return map;
  }, [pieces]);

  const shift = (delta: number) => {
    const total = cursor.year * 12 + cursor.month + delta;
    setCursor({ year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 });
  };

  return (
    <EuphoricCalendar
      year={cursor.year}
      month={cursor.month}
      monthLabel={`${MONTHS_ES[cursor.month]} ${cursor.year}`}
      onPrevMonth={() => shift(-1)}
      onNextMonth={() => shift(1)}
      today={{ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }}
      headerLayout="leading"
      fixedSixWeeks
      headerActions={
        <button
          type="button"
          onClick={() => setCursor(initial)}
          className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          Hoy
        </button>
      }
      renderDay={(isoDate) => (
        <div data-iso={isoDate} className="space-y-1">
          {(byDay[isoDate] ?? []).map((piece) => (
            <CalendarPiece key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    />
  );
}

/**
 * Píldora de la creatividad dentro del día. En el live la aprobada va tachada y en gris; las
 * atrasadas llevan el punto en rosa (misma regla que el badge de deadline: DD1).
 * Inerte, como el resto del módulo (DD4).
 */
function CalendarPiece({ piece }: { piece: CreativePiece }) {
  const done = piece.status === 'Aprobado';
  return (
    <button
      type="button"
      title={piece.title}
      className={cn(
        'flex w-full items-center gap-1.5 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-left text-[11px] hover:border-brand-300 hover:shadow-sm',
        done ? 'text-slate-400 line-through' : 'text-slate-700'
      )}
    >
      <span
        aria-hidden
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', piece.isOverdue ? 'bg-rose-500' : 'bg-slate-300')}
      />
      <span className="truncate">{piece.title}</span>
    </button>
  );
}
