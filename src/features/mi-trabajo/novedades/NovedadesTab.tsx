import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  novedades as seed,
  MODULOS_NOVEDAD,
  TAGS_NOVEDAD,
  type Audiencia,
  type Novedad,
} from './data/novedades';
import { filtrarNovedades, alternar, FILTRO_VACIO, type FiltroTipo } from './lib/filtrar';
import { NovedadCard } from './NovedadCard';

/** El segmentado del live: «Todo» delante de los tres tipos. */
const SEGMENTOS: FiltroTipo[] = ['Todo', 'Nuevo', 'Mejora', 'Arreglo'];

const chip = 'rounded-full px-2.5 py-1 text-xs font-medium';

export function NovedadesTab() {
  const [items, setItems] = useState<Novedad[]>(seed);
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState<FiltroTipo>('Todo');
  const [modulos, setModulos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [abierta, setAbierta] = useState<string | null>(null);

  const visibles = useMemo(
    () => filtrarNovedades(items, { ...FILTRO_VACIO, texto, tipo, modulos, tags }),
    [items, texto, tipo, modulos, tags]
  );

  const cambiarAudiencia = (id: string, audiencia: Audiencia) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, audiencia } : n)));

  const archivar = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          aria-label="Buscar en novedades"
          placeholder="Buscar en novedades…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="input h-9 max-w-xs text-sm"
        />

        {/* Segmentado de tipo: pastilla única con separadores, como el live. */}
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white text-xs">
          {SEGMENTOS.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={tipo === s}
              onClick={() => setTipo(s)}
              className={cn(
                'px-2.5 py-1.5 font-medium',
                i > 0 && 'border-l border-slate-200',
                tipo === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chips de módulo · chips de tag */}
      <div className="flex flex-wrap items-center gap-1.5">
        {MODULOS_NOVEDAD.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={modulos.includes(m)}
            onClick={() => setModulos((prev) => alternar(prev, m))}
            className={cn(
              chip,
              modulos.includes(m)
                ? 'bg-[#44444C] text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            )}
          >
            {m}
          </button>
        ))}

        <span aria-hidden="true" className="px-1 text-slate-300">
          ·
        </span>

        {TAGS_NOVEDAD.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tags.includes(t)}
            onClick={() => setTags((prev) => alternar(prev, t))}
            className={cn(
              chip,
              tags.includes(t)
                ? 'bg-[#44444C] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            #{t}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
          No hay novedades que encajen con este filtro.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {visibles.map((n) => (
            <NovedadCard
              key={n.id}
              novedad={n}
              abierta={abierta === n.id}
              onToggle={() => setAbierta((prev) => (prev === n.id ? null : n.id))}
              onAudiencia={(a) => cambiarAudiencia(n.id, a)}
              onArchivar={() => archivar(n.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
