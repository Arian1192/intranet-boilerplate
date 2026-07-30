import { CAJAS_PERMISOS } from '../data/usuarios';
import type { ClavePermiso } from '../lib/permisos';

export interface CajasPermisosProps {
  activos: Set<ClavePermiso>;
  onToggle: (k: ClavePermiso) => void;
}

/** Las 11 cajas de permisos por módulo: checkboxes sueltos, sin columnas Ver/Editar. */
export function CajasPermisos({ activos, onToggle }: CajasPermisosProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {CAJAS_PERMISOS.map((caja) => (
        <section
          key={caja.titulo}
          className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
        >
          {/* slate-400, como todo subtítulo interno del live; brand-600 aquí solo va en el check. */}
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {caja.titulo}
          </h3>
          <div className="space-y-1.5">
            {caja.items.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-start gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={activos.has(item)}
                  onChange={() => onToggle(item)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {item}
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
