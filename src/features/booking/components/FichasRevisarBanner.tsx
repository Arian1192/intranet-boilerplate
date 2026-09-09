import type { FichasRevisar } from '@/types';

export interface FichasRevisarBannerProps {
  fichas: FichasRevisar;
}

export function FichasRevisarBanner({ fichas }: FichasRevisarBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/60 px-5 py-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-700">
          Fichas a revisar
        </h2>
        <p className="mt-0.5 text-sm text-rose-600">
          {fichas.artistas} artistas con datos pendientes · {fichas.datos} datos ·{' '}
          {fichas.documentos} documentos · {fichas.bios} bios
        </p>
      </div>
      <button
        type="button"
        aria-label="Desplegar fichas a revisar"
        className="shrink-0 rounded-md px-2 py-1 text-rose-500 hover:bg-rose-100"
      >
        ▸
      </button>
    </div>
  );
}
