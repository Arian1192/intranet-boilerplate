import { useState } from 'react';
import { cn } from '@/lib/utils';
import { saludo } from '../lib/greeting';
import { PendientesTab } from '../tabs/PendientesTab';
import { MisCreatividadesTab } from '../tabs/MisCreatividadesTab';
import { NovedadesTab } from '../novedades/NovedadesTab';
import { MiTrabajoPage } from './MiTrabajoPage';

/** Las 4 pestañas del conmutador, en el orden del live. */
export const PESTANAS = ['Pendientes', 'Documentos', 'Mis creatividades', 'Novedades'] as const;
export type Pestana = (typeof PESTANAS)[number];

export interface MiEspacioPageProps {
  /** Nombre del usuario para el saludo de cabecera. */
  usuario: string;
}

export function MiEspacioPage({ usuario }: MiEspacioPageProps) {
  // La raíz de /mi-trabajo aterriza en Pendientes, no en el editor.
  const [pestana, setPestana] = useState<Pestana>('Pendientes');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-base font-semibold text-slate-800">{saludo(usuario)}</h1>

        <div
          role="tablist"
          aria-label="Secciones de Mi trabajo"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1"
        >
          {PESTANAS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={pestana === p}
              onClick={() => setPestana(p)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                pestana === p
                  ? 'bg-[#44444C] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              {p}
              {/* El live marca Novedades con un punto verde de aviso. */}
              {p === 'Novedades' && <span data-testid="novedades-dot" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
          ))}
        </div>
      </div>

      {pestana === 'Pendientes' && <PendientesTab usuario={usuario} />}
      {pestana === 'Documentos' && <MiTrabajoPage />}
      {pestana === 'Mis creatividades' && <MisCreatividadesTab />}
      {pestana === 'Novedades' && <NovedadesTab />}
    </div>
  );
}
