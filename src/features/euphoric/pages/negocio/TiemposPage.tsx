import { useState } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { phaseTimes, stalledItems } from '../../data/negocio';

const FILTERS = ['Todo', 'Creatividad', 'Publicación', 'Petición'] as const;
type Filter = (typeof FILTERS)[number];

export function TiemposPage() {
  const [filter, setFilter] = useState<Filter>('Todo');

  const visiblePhases = phaseTimes.filter((phase) => filter === 'Todo' || phase.entity === filter);
  const visibleStalled = stalledItems.filter((item) => filter === 'Todo' || item.entity === filter);
  const entities = [...new Set(visiblePhases.map((phase) => phase.entity))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tiempos</h1>
        <p className="text-slate-500">
          Cuánto tarda cada cosa en cada fase, y qué está parado ahora. (Tiempo de reloj entre estados, no horas
          trabajadas.)
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              filter === option
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-200 text-slate-500 hover:text-slate-700'
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <Card role="region" aria-label="Tiempo medio por fase" className="space-y-4 p-5">
        <p className="text-xs font-semibold tracking-wide text-slate-400">TIEMPO MEDIO POR FASE</p>
        {entities.length === 0 ? (
          <p className="text-sm text-slate-400">Sin datos todavía.</p>
        ) : (
          entities.map((entity) => (
            <div key={entity} className="space-y-2">
              <p className="text-sm font-medium text-slate-700">{entity}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {visiblePhases
                  .filter((phase) => phase.entity === entity)
                  .map((phase) => (
                    <div key={phase.id} className="rounded-lg border border-slate-100 p-3">
                      <p className="text-xs text-slate-500">{phase.phase}</p>
                      <p className="text-lg font-semibold text-slate-800">{phase.average}</p>
                      <p className="text-xs text-slate-400">{phase.times}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </Card>

      <Card role="region" aria-label="Parado ahora" className="space-y-3 p-5">
        <p className="text-xs font-semibold tracking-wide text-slate-400">
          PARADO AHORA (MÁS TIEMPO EN SU FASE)
        </p>
        <ul className="divide-y divide-slate-100">
          {visibleStalled.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-400">
                  {item.entity} · {item.status} · {item.account}
                </p>
              </div>
              <span className="shrink-0 text-sm text-slate-500">{item.age}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
