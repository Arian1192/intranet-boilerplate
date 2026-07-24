import type { Venue } from '../data/contactos';

export interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const ubicacion = [venue.city, venue.country].filter(Boolean).join(' · ');

  return (
    <div role="group" aria-label={venue.name} className="relative rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* Editar ✎ inerte (spec D2) */}
      <button
        type="button"
        aria-label={`Editar ${venue.name}`}
        className="absolute right-3 top-3 text-slate-300 hover:text-slate-500"
      >
        ✎
      </button>
      <h3 className="pr-6 font-semibold text-slate-900">{venue.name}</h3>
      <p className="mt-0.5 truncate text-sm text-slate-500">
        {venue.address}
        {ubicacion && ` · ${ubicacion}`}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {venue.ubicado && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            📍 Ubicado
          </span>
        )}
        {venue.aforo !== null && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Aforo {venue.aforo}
          </span>
        )}
      </div>
    </div>
  );
}
