import type { Ficha, Person } from '../data/types';
import { companies } from '../data/fichas';

export interface FichaListRowProps {
  person: Person;
  ficha: Ficha;
}

export function FichaListRow({ person, ficha }: FichaListRowProps) {
  const positions = person.positions.length ? person.positions.join(' · ') : undefined;
  const employmentTypeLabel = ficha.employmentType === 'contratado' ? 'Contratado' : 'Freelance';
  const subtitle = `${employmentTypeLabel}${positions ? ` · ${positions}` : ''}`;
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-slate-800">{person.name}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        {ficha.companyIds.map((id) => {
          const company = companies.find((c) => c.id === id)!;
          return (
            <span
              key={id}
              aria-label={company.name}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: company.colorHex }}
            />
          );
        })}
      </div>
    </div>
  );
}
