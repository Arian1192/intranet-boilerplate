import type { BloqueMatriz } from '../data/usuarios';
import { clave, type ClavePermiso } from '../lib/permisos';

export interface MatrizPermisosProps {
  bloque: BloqueMatriz;
  activos: Set<ClavePermiso>;
  onToggle: (k: ClavePermiso) => void;
}

export function MatrizPermisos({ bloque, activos, onToggle }: MatrizPermisosProps) {
  return (
    <section className="mt-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-600">{bloque.titulo}</h3>
      <p className="text-xs text-slate-400">{bloque.sub}</p>

      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
            <th className="py-1 text-left font-medium">Sección</th>
            <th className="w-16 py-1 text-center font-medium">Ver</th>
            <th className="w-16 py-1 text-center font-medium">Editar</th>
          </tr>
        </thead>
        <tbody>
          {bloque.filas.map((fila) => (
            <tr key={fila.nombre} className="border-b border-slate-50">
              <td className="py-1.5 pr-4">
                <div className="text-slate-700">{fila.nombre}</div>
                {fila.nota && <div className="text-xs text-slate-400">{fila.nota}</div>}
              </td>
              {(['ver', 'editar'] as const).map((col) => {
                const k = clave(fila.nombre, col);
                return (
                  <td key={col} className="py-1.5 text-center">
                    {fila[col] === 'check' ? (
                      <input
                        type="checkbox"
                        aria-label={`${fila.nombre} · ${col === 'ver' ? 'Ver' : 'Editar'}`}
                        checked={activos.has(k)}
                        onChange={() => onToggle(k)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
