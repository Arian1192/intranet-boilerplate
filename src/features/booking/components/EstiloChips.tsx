import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ESTILOS } from '../data/disponibilidad';

/**
 * Chips de estilo (spec D1): estado toggle local puramente visual; NO recalculan
 * la lista de artistas libres (mock fiel al live).
 */
export function EstiloChips() {
  const [activos, setActivos] = useState<Set<string>>(new Set());

  const toggle = (estilo: string) =>
    setActivos((prev) => {
      const next = new Set(prev);
      if (next.has(estilo)) next.delete(estilo);
      else next.add(estilo);
      return next;
    });

  return (
    <div className="flex flex-wrap gap-2">
      {ESTILOS.map((estilo) => (
        <button
          key={estilo}
          type="button"
          onClick={() => toggle(estilo)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            activos.has(estilo)
              ? 'border-brand-300 bg-brand-50 text-brand-700'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          )}
        >
          {estilo}
        </button>
      ))}
    </div>
  );
}
