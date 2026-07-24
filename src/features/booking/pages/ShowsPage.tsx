import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ShowCard, ShowsToolbar, FiltrosDrawer } from '@/features/booking/components';
import type { ShowsFiltros } from '@/features/booking/components';
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

const filtrosVacios: ShowsFiltros = { etapa: '', fase: '', pago: '', artista: '' };

export function ShowsPage() {
  const { shows, isLoading, error } = useShows();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filtrosAbierto, setFiltrosAbierto] = useState(false);
  const [filtros, setFiltros] = useState<ShowsFiltros>(() => {
    const status = searchParams.get('status');
    return isShowStatus(status) ? { ...filtrosVacios, etapa: status } : filtrosVacios;
  });

  const shownShows = shows.filter(
    (show) =>
      matchesQuery(show, query) &&
      (!filtros.etapa || show.etapa === filtros.etapa) &&
      (!filtros.fase || show.fase === filtros.fase) &&
      (!filtros.pago || show.paymentStatus === filtros.pago) &&
      (!filtros.artista || show.artist === filtros.artista)
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
        onOpenFiltros={() => setFiltrosAbierto(true)}
      />
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {shownShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
      <FiltrosDrawer
        abierto={filtrosAbierto}
        filtros={filtros}
        onChange={setFiltros}
        onClose={() => setFiltrosAbierto(false)}
      />
    </div>
  );
}
