import { useState } from 'react';
import { cn } from '@/lib/utils';
import { VenueCard, EmpresaRow } from '@/features/booking/components';
import { venues, empresas } from '../data/contactos';

type Tab = 'venues' | 'empresas';

export function ContactosPage() {
  const [tab, setTab] = useState<Tab>('venues');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const venuesFiltrados = q
    ? venues.filter(
        (v) => v.name.toLowerCase().includes(q) || (v.city ?? '').toLowerCase().includes(q)
      )
    : venues;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Contactos</h1>
        <p className="mt-1 text-sm text-slate-500">Venues y empresas con las que trabaja ConceptOne.</p>
      </div>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-2 border-b border-slate-100 pb-3">
        {([
          ['venues', 'Venues'],
          ['empresas', 'Empresas y contactos'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              tab === value
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'venues' ? (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar venue o ciudad…"
              className="h-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {/* + Nuevo venue inerte (spec D2) */}
            <button
              type="button"
              className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              + Nuevo venue
            </button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {venuesFiltrados.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-end">
            {/* + Nuevo… inerte (spec D2) */}
            <button
              type="button"
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              + Nuevo…
            </button>
          </div>
          <div role="list" className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            {empresas.map((e) => (
              <EmpresaRow key={e.id} empresa={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
