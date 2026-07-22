import { Link } from 'react-router';
import { Avatar } from '@/components/ui';
import type { Person } from '../data/types';

export interface PersonCardProps {
  person: Person;
  managerName?: string;
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export function PersonCard({ person, managerName }: PersonCardProps) {
  const displayPosition = person.primaryPosition || person.positions[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar src={person.photoUrl} fallback={getInitials(person.name)} size="lg" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800">{person.name}</h3>
          {displayPosition ? (
            <p className="text-sm text-slate-600">{displayPosition}</p>
          ) : (
            <p className="text-sm text-slate-400">—</p>
          )}
          {person.department && (
            <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {person.department}
            </span>
          )}
          <div className="mt-2 space-y-0.5 text-sm">
            <p className={person.email ? 'text-slate-600' : 'text-slate-400'}>
              {person.email || 'Sin email'}
            </p>
            <p className={person.phone ? 'text-slate-600' : 'text-slate-400'}>
              {person.phone || 'Sin teléfono'}
            </p>
          </div>
          {managerName && (
            <p className="mt-2 text-sm text-slate-600">Reporta a {managerName}</p>
          )}
          <Link
            to={`/personal/fichas?p=${person.id}`}
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ver ficha personal →
          </Link>
        </div>
      </div>
    </div>
  );
}
