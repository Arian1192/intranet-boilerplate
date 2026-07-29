import { cn } from '@/lib/utils';
import { AUDIENCIAS, type Audiencia, type Novedad, type TipoNovedad } from './data/novedades';

/**
 * Color de cada tipo, muestreado del live.
 * «Mejora» va en la escala `brand` del live, que es un carbón neutro
 * (brand-100 #ECECED / brand-700 #37373D), no el morado de nuestro tailwind.config.
 */
const COLOR_TIPO: Record<TipoNovedad, string> = {
  Nuevo: 'bg-emerald-100 text-emerald-700',
  Mejora: 'bg-[#ECECED] text-[#37373D]',
  Arreglo: 'bg-amber-100 text-amber-700',
};

/** Las audiencias restringidas llevan badge propio; «Todos» no pinta nada. */
const COLOR_AUDIENCIA: Record<string, string> = {
  'Solo equipo': 'bg-sky-100 text-sky-700',
  'Solo Admin': 'bg-purple-100 text-purple-700',
};

const badge = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

export interface NovedadCardProps {
  novedad: Novedad;
  abierta: boolean;
  onToggle: () => void;
  onAudiencia: (audiencia: Audiencia) => void;
  onArchivar: () => void;
}

export function NovedadCard({ novedad, abierta, onToggle, onAudiencia, onArchivar }: NovedadCardProps) {
  const { detalle } = novedad;

  return (
    <li data-testid="novedad" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierta}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50"
      >
        {/* Marca de no leída */}
        <span
          data-testid={novedad.noLeida ? 'no-leida' : 'leida'}
          className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', novedad.noLeida ? 'bg-emerald-500' : 'bg-transparent')}
        />

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className={cn(badge, COLOR_TIPO[novedad.tipo])}>{novedad.tipo}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {novedad.modulo}
            </span>
            {novedad.audiencia !== 'Todos' && (
              <span className={cn(badge, COLOR_AUDIENCIA[novedad.audiencia])}>{novedad.audiencia}</span>
            )}
            <h3 className="text-sm font-semibold text-slate-800">{novedad.titulo}</h3>
          </span>

          <span className="mt-1 block text-sm text-slate-600">{novedad.resumen}</span>

          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400">{novedad.fecha}</span>
            {novedad.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                #{t}
              </span>
            ))}
          </span>
        </span>

        <span aria-hidden="true" className="mt-1 shrink-0 text-xs text-slate-400">
          {abierta ? '▾' : '▸'}
        </span>
      </button>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-xs">
        <span className="text-slate-400">Admin:</span>
        <label className="flex items-center gap-1.5 text-slate-500">
          Audiencia
          <select
            aria-label={`Audiencia de «${novedad.titulo}»`}
            value={novedad.audiencia}
            onChange={(e) => onAudiencia(e.target.value as Audiencia)}
            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs"
          >
            {AUDIENCIAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onArchivar}
          className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
        >
          Archivar
        </button>
      </div>

      {abierta && (
        <div className="space-y-3 border-t border-slate-100 px-4 py-3 pl-9 text-sm">
          {detalle.cuerpo && <p className="leading-relaxed text-slate-700">{detalle.cuerpo}</p>}

          {detalle.porQue && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Por qué</div>
              <p className="leading-relaxed text-slate-600">{detalle.porQue}</p>
            </div>
          )}

          {detalle.paraQuien.length > 0 && (
            <div className="rounded-lg bg-[#F6F6F7]/60 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#37373D]">
                Podría interesarte para…
              </div>
              <ul className="list-disc space-y-0.5 pl-4 text-slate-700">
                {detalle.paraQuien.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
