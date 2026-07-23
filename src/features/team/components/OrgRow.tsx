import { Link } from 'react-router';
import { Avatar } from '@/components/ui';
import type { Person } from '../data/types';
import { directReports, personLabel } from '../data/people';

export interface OrgRowProps {
  person: Person;
  level?: number;
  reports?: Person[];
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export function OrgRow({ person, level = 0, reports }: OrgRowProps) {
  const direct = reports ?? directReports(person.id);
  const label = personLabel(person);
  return (
    <div style={{ marginLeft: `${level * 24}px` }} className="space-y-2">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-3">
          <Avatar src={person.photoUrl} fallback={getInitials(person.name)} size="sm" style={{ backgroundColor: person.avatarColor }} />
          <div>
            <p className="font-medium text-slate-800">{person.name}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
          {direct.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {direct.length} {direct.length === 1 ? 'persona' : 'personas'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              aria-label="Enviar email"
              className="text-slate-400 hover:text-slate-600"
            >
              ✉
            </a>
          )}
          <Link
            to={`/personal/fichas?p=${person.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ficha
          </Link>
        </div>
      </div>
      {direct.map((report) => (
        <OrgRow key={report.id} person={report} level={level + 1} />
      ))}
    </div>
  );
}
