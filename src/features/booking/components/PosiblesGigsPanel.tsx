import type { PosibleGig } from '@/types';

export interface PosiblesGigsPanelProps {
  gigs: PosibleGig[];
}

export function PosiblesGigsPanel({ gigs }: PosiblesGigsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-violet-200 bg-violet-50/40">
      <div className="flex items-start justify-between gap-4 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
            📅 Posibles gigs en calendario
          </h2>
          <p className="mt-0.5 text-sm text-violet-600">
            Fechas que el artista tiene en su Google Calendar y aún no son shows. Decide si
            perseguirlas.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
          {gigs.length}
        </span>
      </div>

      <div className="divide-y divide-violet-100 border-t border-violet-100 bg-white/60">
        {gigs.map((gig) => (
          <div key={gig.id} className="flex items-center gap-4 px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="font-medium text-violet-700">{gig.artista}</span>
                <span className="text-slate-500"> · </span>
                <span className="font-medium text-slate-800">{gig.titulo}</span>
              </p>
              <p className="truncate text-xs text-slate-500">
                {gig.fecha} — {gig.detalle}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Upgrade a Show →
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Ignorar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
