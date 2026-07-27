import { useState } from 'react';
import { Avatar } from '@/components/ui';
import { buscarPersonas } from '../data/personas';
import type { Responsable } from '../data/types';

interface Props {
  asignados: Responsable[];
  onAdd: (persona: Responsable) => void;
  onClose: () => void;
}

/**
 * Desplegable "＋ Añadir" de responsables. Lista las personas del pool (evidencia del live,
 * `personas.ts`); las ya asignadas aparecen con "✓" y no se re-añaden. Escape / blur cierra.
 */
export function ResponsablesPicker({ asignados, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');
  const asignadoIds = new Set(asignados.map((r) => r.id));
  const resultados = buscarPersonas(query);

  return (
    <div
      className="absolute z-20 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose(); }}
    >
      <input
        type="text"
        autoFocus
        placeholder="Buscar persona…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        className="mb-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm"
      />
      <ul className="max-h-56 overflow-y-auto">
        {resultados.map((persona) => {
          const yaAsignado = asignadoIds.has(persona.id);
          return (
            <li key={persona.id}>
              <button
                type="button"
                disabled={yaAsignado}
                onClick={() => onAdd(persona)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 disabled:cursor-default disabled:opacity-60"
              >
                <Avatar fallback={persona.iniciales} size="sm" className="h-7 w-7 text-[10px]" />
                <span className="flex-1 text-slate-700">{persona.nombre}</span>
                {yaAsignado && <span aria-hidden className="text-emerald-600">✓</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
