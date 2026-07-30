import type { BloqueMatriz } from '../data/usuarios';
import { clave, type ClavePermiso } from '../lib/permisos';

export interface MatrizPermisosProps {
  bloque: BloqueMatriz;
  activos: Set<ClavePermiso>;
  onToggle: (k: ClavePermiso) => void;
}

export function MatrizPermisos({ bloque, activos, onToggle }: MatrizPermisosProps) {
  return (
    <section className="rounded-lg border border-slate-200">
      {/* El live encabeza cada bloque con una franja propia separada por un filete. */}
      <div className="border-b border-slate-100 px-3 py-2">
        {/* El live usa un div; mantenemos h3 por accesibilidad — mismas clases, mismo píxel. */}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {bloque.titulo}
        </h3>
        <p className="text-xs text-slate-400">{bloque.sub}</p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
            <th className="px-3 py-1.5 text-left font-medium">Sección</th>
            <th className="w-16 py-1.5 text-center font-medium">Ver</th>
            <th className="w-16 py-1.5 text-center font-medium">Editar</th>
          </tr>
        </thead>
        <tbody>
          {bloque.filas.map((fila) => (
            <tr
              key={fila.nombre}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
            >
              <td className="px-3 py-1.5">
                <div className="font-medium text-slate-700">{fila.nombre}</div>
                {fila.nota && (
                  <div className="text-xs leading-snug text-slate-400">{fila.nota}</div>
                )}
              </td>
              {(['ver', 'editar'] as const).map((col) => {
                const k = clave(fila.nombre, col);
                return (
                  <td key={col} className="text-center">
                    {fila[col] === 'check' ? (
                      <input
                        type="checkbox"
                        aria-label={`${fila.nombre} · ${col === 'ver' ? 'Ver' : 'Editar'}`}
                        checked={activos.has(k)}
                        onChange={() => onToggle(k)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
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
