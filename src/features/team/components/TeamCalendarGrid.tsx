import { useMemo } from 'react';
import { Avatar } from '@/components/ui';
import type { Person, Absence } from '../data/types';
import { totalDaysForPerson } from '../data/absences';

export interface TeamCalendarGridProps {
  year: number;
  month: number;
  people: Person[];
  absences: Absence[];
  approvedOnly: boolean;
}

const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export function TeamCalendarGrid({ year, month, people, absences, approvedOnly }: TeamCalendarGridProps) {
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;

  const absenceForCell = (personId: string, day: number): Absence | undefined =>
    absences.find((a) => {
      if (approvedOnly && !a.approved) return false;
      const start = new Date(a.startDate).getDate();
      const end = new Date(a.endDate).getDate();
      return a.personId === personId && day >= start && day <= end;
    });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 border-b border-slate-200 bg-slate-50 p-2 text-left font-medium text-slate-600">Persona</th>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dow = new Date(year, month - 1, day).getDay();
              const isWeekend = dow === 0 || dow === 6;
              return (
                <th
                  key={day}
                  className={`border-b border-slate-200 p-2 text-center font-medium text-slate-600 ${
                    isWeekend ? 'bg-slate-100' : 'bg-slate-50'
                  } ${isToday(day) ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <div>{DAY_LETTERS[(dow + 6) % 7]}</div>
                  <div>{day}</div>
                </th>
              );
            })}
            <th className="border-b border-slate-200 bg-slate-50 p-2 text-right font-medium text-slate-600">Días</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id} className="hover:bg-slate-50">
              <td className="sticky left-0 z-10 border-b border-slate-200 bg-white p-2">
                <div className="flex items-center gap-2">
                  <Avatar src={person.photoUrl} fallback={getInitials(person.name)} size="sm" />
                  <span className="text-slate-700">{person.name}</span>
                </div>
              </td>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dow = new Date(year, month - 1, day).getDay();
                const isWeekend = dow === 0 || dow === 6;
                const absence = absenceForCell(person.id, day);
                return (
                  <td
                    key={day}
                    className={`relative border-b border-slate-200 p-0 ${
                      isWeekend ? 'bg-slate-100' : ''
                    } ${isToday(day) ? 'bg-blue-50' : ''}`}
                  >
                    {absence && (
                      <div className="absolute inset-y-1 left-0 right-0 rounded bg-purple-500/90" />
                    )}
                  </td>
                );
              })}
              <td className="border-b border-slate-200 p-2 text-right text-slate-600">
                {totalDaysForPerson(person.id, year, month)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
