import { useMemo, useState } from 'react';
import { CalendarLegend } from '../components/CalendarLegend';
import { TeamCalendarGrid } from '../components/TeamCalendarGrid';
import { absencesForMonth, todaysAbsence } from '../data/absences';
import { allPeople } from '../data/people';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function CalendarioPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7);
  const [approvedOnly, setApprovedOnly] = useState(false);

  const people = useMemo(() => allPeople(), []);
  const absences = useMemo(() => absencesForMonth(year, month, { approvedOnly }), [year, month, approvedOnly]);
  const todayInfo = useMemo(() => todaysAbsence('2026-07-22'), []);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Calendario del equipo</h1>
        <p className="text-slate-500">Quién está fuera y quién teletrabaja, de un vistazo.</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Mes anterior"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          ‹
        </button>
        <span className="min-w-[120px] text-center font-medium text-slate-800">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Mes siguiente"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          ›
        </button>
      </div>
      {todayInfo && (
        <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
          <span className="font-medium">Hoy:</span>{' '}
          {todayInfo.person.name} ·{' '}
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            Vacaciones
          </span>
        </div>
      )}
      <CalendarLegend approvedOnly={approvedOnly} onApprovedOnly={setApprovedOnly} />
      <TeamCalendarGrid year={year} month={month} people={people} absences={absences} approvedOnly={approvedOnly} />
      <p className="text-xs text-slate-400">
        Pasa el ratón por una fila para seguirla. Las solicitudes pendientes de aprobar se ven translúcidas. El total de días solo se muestra de ti y de las personas a tu cargo.
      </p>
    </div>
  );
}
