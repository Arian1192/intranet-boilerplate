import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { tours, formatRangoTour, type Tour } from '../data/tours';

/**
 * `/tours` — el listado de giras.
 *
 * Calcado de `docs/references/conceptone-v3-2026-09-09/f1-tours.*`. Las tarjetas
 * del live **navegan** a `/tours/:tourId` (comprobado por clic el 2026-09-09),
 * así que aquí son enlaces y no botones.
 */
export function ToursPage() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tours</h1>
          <p className="text-sm text-slate-500">
            Agrupa shows de un artista en una gira: viabilidad económica (P&amp;L), gastos de tour
            (vuelos, hospedaje, per diems) y agenda de promo.
          </p>
        </div>
        <Button className="shrink-0 text-sm">+ Nuevo tour</Button>
      </div>

      <div className="card mt-5 divide-y divide-slate-100 overflow-hidden">
        {tours.map((tour) => (
          <TarjetaTour key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}

const ESTADO_BADGE: Record<Tour['estado'], string> = {
  planificando: 'badge bg-slate-100 text-slate-600',
  confirmado: 'badge bg-blue-100 text-blue-700',
  cerrado: 'badge bg-emerald-100 text-emerald-700',
  cancelado: 'badge bg-rose-100 text-rose-700',
};

const ESTADO_LABEL: Record<Tour['estado'], string> = {
  planificando: 'Planificando',
  confirmado: 'Confirmado',
  cerrado: 'Cerrado',
  cancelado: 'Cancelado',
};

function TarjetaTour({ tour }: { tour: Tour }) {
  const rango = formatRangoTour(tour);
  // El live encadena artista, territorio y fechas con « · », y se salta el
  // último tramo cuando la gira no tiene fechas.
  const subtitulo = [tour.artista, tour.territorio, rango].filter(Boolean).join(' · ');

  return (
    <Link
      to={`/tours/${tour.id}`}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
    >
      <span className={`${ESTADO_BADGE[tour.estado]} shrink-0`}>{ESTADO_LABEL[tour.estado]}</span>
      <span className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-medium text-slate-800">{tour.nombre}</h2>
        <span className="block truncate text-xs text-slate-400">{subtitulo}</span>
      </span>
      <span className="shrink-0 text-xs text-slate-400">
        {tour.shows.length} {tour.shows.length === 1 ? 'show' : 'shows'}
      </span>
    </Link>
  );
}
