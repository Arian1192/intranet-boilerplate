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
    <div className="mx-auto w-full max-w-[1120px]">
      <h1 className="text-2xl font-semibold text-slate-800">Ofertas entrantes</h1>
      <p className="text-sm text-slate-500">
        Propuestas recibidas desde el formulario público de la web.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
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
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                activo
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              {opcion} ({contarOfertas(todasLasOfertas, opcion)})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <div>
          {visibles.length === 0 ? (
            <p className="py-12 text-center text-slate-400">No hay ofertas aquí.</p>
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

        <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-slate-200 p-6">
          {detalle ? (
            <div className="w-full">
              <h2 className="text-lg font-semibold text-slate-800">{detalle.artista}</h2>
              <p className="text-sm text-slate-500">
                {detalle.evento} · {detalle.ciudad} · {detalle.fecha}
              </p>
              <p className="mt-4 text-sm text-slate-600">{detalle.mensaje}</p>
            </div>
          ) : (
            <p className="text-slate-400">Selecciona una oferta</p>
          )}
        </div>
      </div>
    </div>
  );
}
