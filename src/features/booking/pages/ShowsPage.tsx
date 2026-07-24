import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ShowCard, ShowsToolbar } from '@/features/booking/components';
import type { Show, ShowStatus } from '@/types';
import { useShows } from '../hooks/useShows';

const validStatuses: ShowStatus[] = [
  'tentative',
  'offer',
  'confirmed',
  'contract',
  'pending-payment',
  'pending-settlement',
  'done',
];

function isShowStatus(value: string | null): value is ShowStatus {
  return value !== null && validStatuses.includes(value as ShowStatus);
}

function matchesQuery(show: Show, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [show.artist, show.event, show.venue ?? ''].some((field) =>
    field.toLowerCase().includes(needle)
  );
}

export function ShowsPage() {
  const { shows, isLoading, error } = useShows();
  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get('status');
  const [query, setQuery] = useState('');

  const shownShows = shows.filter(
    (show) =>
      (!isShowStatus(selectedStatus) || show.etapa === selectedStatus) && matchesQuery(show, query)
  );

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <ShowsToolbar
        count={shownShows.length}
        query={query}
        onQueryChange={setQuery}
        rangoLabel="Última semana → Todo el futuro"
        onToggleRango={() => {}}
        onOpenFiltros={() => {}}
      />
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {shownShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
