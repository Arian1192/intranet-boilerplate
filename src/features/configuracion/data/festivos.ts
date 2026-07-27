export type HolidayScope = 'espana' | 'catalunya' | 'barcelona';

export interface Holiday {
  id: string;
  date: string;
  name: string;
  scope: HolidayScope;
}

const HOLIDAYS: Holiday[] = [
  { id: 'hol-2026-08-15', date: '2026-08-15', name: "L'Assumpció", scope: 'espana' },
  { id: 'hol-2026-09-11', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' },
  { id: 'hol-2026-09-24', date: '2026-09-24', name: 'La Mercè', scope: 'barcelona' },
  { id: 'hol-2026-10-12', date: '2026-10-12', name: "Festa Nacional d'Espanya", scope: 'espana' },
  { id: 'hol-2026-12-08', date: '2026-12-08', name: 'La Immaculada', scope: 'espana' },
  { id: 'hol-2026-12-25', date: '2026-12-25', name: 'Nadal', scope: 'espana' },
  { id: 'hol-2026-12-26', date: '2026-12-26', name: 'Sant Esteve', scope: 'catalunya' },
  { id: 'hol-2027-01-01', date: '2027-01-01', name: 'Any Nou', scope: 'espana' },
  { id: 'hol-2027-01-06', date: '2027-01-06', name: 'Reis', scope: 'espana' },
  { id: 'hol-2027-03-26', date: '2027-03-26', name: 'Divendres Sant', scope: 'espana' },
  { id: 'hol-2027-03-29', date: '2027-03-29', name: 'Dilluns de Pasqua Florida', scope: 'catalunya' },
  { id: 'hol-2027-05-01', date: '2027-05-01', name: 'Festa del Treball', scope: 'espana' },
  { id: 'hol-2027-05-17', date: '2027-05-17', name: 'Segona Pasqua (Pasqua Granada)', scope: 'barcelona' },
  { id: 'hol-2027-06-24', date: '2027-06-24', name: 'Sant Joan', scope: 'catalunya' },
  { id: 'hol-2027-08-15', date: '2027-08-15', name: "L'Assumpció", scope: 'espana' },
  { id: 'hol-2027-09-11', date: '2027-09-11', name: 'Diada de Catalunya', scope: 'catalunya' },
  { id: 'hol-2027-09-24', date: '2027-09-24', name: 'La Mercè', scope: 'barcelona' },
  { id: 'hol-2027-10-12', date: '2027-10-12', name: "Festa Nacional d'Espanya", scope: 'espana' },
  { id: 'hol-2027-11-01', date: '2027-11-01', name: 'Tots Sants', scope: 'espana' },
  { id: 'hol-2027-12-06', date: '2027-12-06', name: 'Dia de la Constitució', scope: 'espana' },
  { id: 'hol-2027-12-08', date: '2027-12-08', name: 'La Immaculada', scope: 'espana' },
  { id: 'hol-2027-12-25', date: '2027-12-25', name: 'Nadal', scope: 'espana' },
  { id: 'hol-2027-12-26', date: '2027-12-26', name: 'Sant Esteve', scope: 'catalunya' },
];

export function holidays(): Holiday[] {
  return HOLIDAYS.map((h) => ({ ...h }));
}

export function isPast(holiday: Holiday, today: Date = new Date()): boolean {
  const d = new Date(`${holiday.date}T00:00:00`);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

export function filterHolidays(list: Holiday[], opts: { includePast: boolean }): Holiday[] {
  if (opts.includePast) return [...list];
  return list.filter((h) => !isPast(h));
}

export function groupByYear(list: Holiday[]): { year: number; items: Holiday[] }[] {
  const byYear = new Map<number, Holiday[]>();
  [...list]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((h) => {
      const year = Number(h.date.slice(0, 4));
      const bucket = byYear.get(year);
      if (bucket) bucket.push(h);
      else byYear.set(year, [h]);
    });
  return [...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, items]) => ({ year, items }));
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

export function formatHolidayDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
}
