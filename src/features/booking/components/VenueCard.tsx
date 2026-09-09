import type { Venue } from '../data/contactos';

export interface VenueCardProps {
  venue: Venue;
}

/**
 * Tarjeta de venue de `/contactos`.
 *
 * Calcada del live el 2026-09-09: la tarjeta entera **es un botón** con la
 * clase `card`, el subtítulo es `dirección · ciudad · país`, y los badges van
 * en este orden — primero el aforo, después el «Ubicado» —, que es el contrario
 * del que teníamos. El ✎ es un adorno dentro del propio botón, no otro botón.
 */
export function VenueCard({ venue }: VenueCardProps) {
  const ubicacion = [venue.city, venue.country].filter(Boolean).join(' · ');
  const subtitulo = ubicacion ? `${venue.address} · ${ubicacion}` : venue.address;

  return (
    <button
      type="button"
      aria-label={`Ficha de ${venue.name}`}
      className="card flex items-start gap-3 p-3 text-left transition-shadow hover:shadow-md"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-slate-800">{venue.name}</span>
        <span className="block truncate text-xs text-slate-500">{subtitulo}</span>
        {(venue.aforo !== null || venue.ubicado) && (
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            {venue.aforo !== null && (
              <span className="badge bg-slate-100 text-slate-600">Aforo {venue.aforo}</span>
            )}
            {venue.ubicado && (
              <span className="badge bg-emerald-100 text-emerald-700">📍 Ubicado</span>
            )}
          </span>
        )}
      </span>
      <span className="shrink-0 text-slate-300">✎</span>
    </button>
  );
}
