import type { Absence, AbsenceType } from './types';
import { people } from './people';

export const absences: Absence[] = [
  {
    id: 'abs-alejandro-jul',
    personId: 'alejandro-gonzalez',
    type: 'vacaciones' as AbsenceType,
    startDate: '2026-07-03',
    endDate: '2026-07-07',
    approved: true,
  },
  {
    id: 'abs-carlos-pego-jul',
    personId: 'carlos-pego',
    type: 'vacaciones' as AbsenceType,
    startDate: '2026-07-03',
    endDate: '2026-07-05',
    approved: true,
  },
  {
    id: 'abs-carlos-ramudo-jul',
    personId: 'carlos-ramudo',
    type: 'vacaciones' as AbsenceType,
    startDate: '2026-07-16',
    endDate: '2026-07-22',
    approved: true,
  },
];

export const absencesForMonth = (
  year: number,
  month: number,
  opts?: { approvedOnly?: boolean }
): Absence[] => {
  const list = absences.filter((a) => {
    const start = new Date(a.startDate);
    const inMonth = start.getFullYear() === year && start.getMonth() + 1 === month;
    const approved = opts?.approvedOnly ? a.approved : true;
    return inMonth && approved;
  });
  return list;
};

export const absenceDays = (absence: Absence): number => {
  const start = new Date(absence.startDate);
  const end = new Date(absence.endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
};

export const todaysAbsence = (isoToday: string): { person: typeof people[number]; absence: Absence } | undefined => {
  const today = new Date(isoToday);
  const found = absences.find((a) => {
    const start = new Date(a.startDate);
    const end = new Date(a.endDate);
    return today >= start && today <= end;
  });
  if (!found) return undefined;
  const person = people.find((p) => p.id === found.personId);
  if (!person) return undefined;
  return { person, absence: found };
};

export const totalDaysForPerson = (
  personId: string,
  year: number,
  month: number
): number | '—' => {
  const personAbsences = absencesForMonth(year, month).filter((a) => a.personId === personId);
  const total = personAbsences.reduce((sum, a) => sum + absenceDays(a), 0);
  return total === 0 ? '—' : total;
};
