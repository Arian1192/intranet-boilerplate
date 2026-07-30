import { CAJAS_PERMISOS } from '../data/usuarios';
import type { ClavePermiso } from '../lib/permisos';

export interface CajasPermisosProps {
  activos: Set<ClavePermiso>;
  onToggle: (k: ClavePermiso) => void;
}

/** Las 11 cajas de permisos por módulo: checkboxes sueltos, sin columnas Ver/Editar. */
export function CajasPermisos({ activos, onToggle }: CajasPermisosProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CAJAS_PERMISOS.map((caja) => (
        <section key={caja.titulo} className="rounded-lg border border-slate-200 p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {caja.titulo}
          </h3>
          <div className="space-y-1.5">
            {caja.items.map((item) => (
              <label key={item} className="flex items-start gap-2 text-xs text-slate-600">
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
