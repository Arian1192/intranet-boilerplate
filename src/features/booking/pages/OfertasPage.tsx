import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  OFERTA_FILTROS,
  OFERTA_FILTRO_INICIAL,
  ofertas as todasLasOfertas,
  filterOfertas,
  contarOfertas,
  type OfertaFiltro,
} from '../data/ofertas';

export function OfertasPage() {
  const [filtro, setFiltro] = useState<OfertaFiltro>(OFERTA_FILTRO_INICIAL);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);

  const visibles = useMemo(() => filterOfertas(todasLasOfertas, filtro), [filtro]);
  const detalle = visibles.find((oferta) => oferta.id === seleccionada) ?? null;

  return (
    // El live envuelve esta pantalla en su propio contenedor, más estrecho que
    // el `max-w-7xl` del shell, y le da una cabecera distinta a la de las demás
    // (`text-xl font-bold`): es una pantalla que no se ha rehecho con apx.
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ofertas entrantes</h1>
          <p className="text-sm text-slate-500">
            Propuestas recibidas desde el formulario público de la web.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {OFERTA_FILTROS.map((opcion) => {
          const activo = opcion === filtro;
          return (
            <button
              key={opcion}
              type="button"
              aria-pressed={activo}
              onClick={() => {
                setFiltro(opcion);
                setSeleccionada(null);
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                // El activo va SIN borde; sólo lo llevan los apagados.
                activo
                  ? 'bg-slate-800 text-white'
                  : 'border border-slate-200 bg-white text-slate-600'
              )}
            >
              {opcion} ({contarOfertas(todasLasOfertas, opcion)})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          {visibles.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No hay ofertas aquí.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {visibles.map((oferta) => (
                <li key={oferta.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccionada(oferta.id)}
                    className={cn(
                      'block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
                      seleccionada === oferta.id && 'bg-slate-50'
                    )}
                  >
                    <span className="block text-sm font-medium text-slate-800">
                      {oferta.artista} · {oferta.evento}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {oferta.ciudad} · {oferta.fecha}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {detalle ? (
            // El live nunca enseña este panel con datos —la bandeja está vacía—,
            // así que aquí no hay foto que calcar: se deja lo que ya teníamos y
            // sin la altura fija, que sí está medida pero sólo para el vacío.
            <div className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800">{detalle.artista}</h2>
              <p className="text-sm text-slate-500">
                {detalle.evento} · {detalle.ciudad} · {detalle.fecha}
              </p>
              <p className="mt-4 text-sm text-slate-600">{detalle.mensaje}</p>
            </div>
          ) : (
            <div className="grid h-40 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              Selecciona una oferta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
