import { formatCurrency } from '@/lib/format';
import type { Ficha, Person } from '../data/types';

export interface CostByPersonCardProps {
  ranking: { person: Person; ficha: Ficha }[];
}

export function CostByPersonCard({ ranking }: CostByPersonCardProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500">COSTE POR PERSONA</h3>
      <div className="mt-3 space-y-2">
        {ranking.map(({ person, ficha }) => (
          <div key={person.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-slate-800">{person.name}</p>
              <p className="text-xs text-slate-500">
                {person.primaryPosition || person.positions[0] || '—'}
              </p>
            </div>
            <span className="font-bold text-slate-800">{formatCurrency(ficha.monthlyCost!)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
