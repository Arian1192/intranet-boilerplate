import { useState } from 'react';
import { MonthNav, MonthGrid } from '@/features/booking/components';
import { eventsForMonth } from '../data/calendar';

export function CalendarioPage() {
  const [{ year, month }, setMes] = useState({ year: 2026, month: 6 }); // julio 2026

  const goPrev = () =>
    setMes(({ year, month }) => (month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }));
  const goNext = () =>
    setMes(({ year, month }) => (month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }));

  const events = eventsForMonth(year, month);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Calendario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Shows y holds de artista en un solo sitio. Un hold puede subir a show sin duplicar.
          </p>
        </div>
        {/* "+ Hold" inerte (spec D2: mock documentado, sin mutar estado) */}
        <button
          type="button"
          className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Hold
        </button>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <MonthNav year={year} month={month} onPrev={goPrev} onNext={goNext} />
        <MonthGrid year={year} month={month} events={events} />
      </div>
    </div>
  );
}
