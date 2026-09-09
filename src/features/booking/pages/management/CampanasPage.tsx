import { useMemo, useState } from 'react';
import { ApxDd } from '@/features/booking/components/ApxDd';
import { formatCurrency } from '@/lib/format';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import {
  CAMPANAS,
  CANALES_CAMPANA,
  ESTADOS_CAMPANA,
  type EstadoCampana,
} from '@/features/booking/data/management-campanas';

/**
 * Paleta de los estados, leída del volcado del `<main>`: `Aprobada` va en
 * `brand-*` (dentro de `.apx` sale violeta), `Activa` en esmeralda y `Propuesta`
 * en gris.
 *
 * `Completada` y `Cancelada` **no salen en la captura** —no hay ninguna campaña
 * en esos estados—, así que se dejan en el gris neutro en vez de inventarles un
 * color: el día que el live enseñe una, se mide y se corrige.
 */
const PALETA: Record<EstadoCampana, string> = {
  Propuesta: 'bg-slate-100 text-slate-600',
  Aprobada: 'bg-brand-100 text-brand-700',
  Activa: 'bg-emerald-100 text-emerald-700',
  Completada: 'bg-slate-100 text-slate-600',
  Cancelada: 'bg-slate-100 text-slate-600',
};

/** El live escribe «1 campaña» y «0 campañas»; medido filtrando. */
function contador(n: number) {
  return n === 1 ? '1 campaña' : `${n} campañas`;
}

/**
 * `/management/campanas` — calco del live del 2026-09-09.
 *
 * Los tres filtros funcionan y **los tres KPI se recalculan con ellos**, que es
 * lo medido en el live: filtrando por Abdon pasa de `1150,00 € / 450,00 € / 1`
 * y «11 campañas» a `0,00 € / 250,00 € / 0` y «3 campañas».
 *
 * Las filas son un `button` porque en el live abren el modal `Editar campaña`.
 * Ese modal es la **Fase G**; aquí el botón se deja sin acción todavía.
 */
export function CampanasPage() {
  const [artista, setArtista] = useState<string | null>(null);
  const [canal, setCanal] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);

  const visibles = useMemo(
    () =>
      CAMPANAS.filter(
        (c) =>
          (!artista || c.artista === artista) &&
          (!canal || c.canal === canal) &&
          (!estado || c.estado === estado)
      ),
    [artista, canal, estado]
  );

  const inversionDelArtista = visibles
    .filter((c) => c.paga === 'Artista' || c.paga === 'Compartido')
    .reduce((total, c) => total + c.gasto, 0);
  const presupuestoActivo = visibles
    .filter((c) => c.estado === 'Aprobada' || c.estado === 'Activa')
    .reduce((total, c) => total + c.presupuesto, 0);
  const activas = visibles.filter((c) => c.estado === 'Activa').length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Campañas</h1>
          <p className="text-sm text-slate-500">
            Inversión en marketing por canal. La del artista es la que cuenta para el retorno.
          </p>
        </div>
        <button type="button" className="btn-primary text-sm">
          + Nueva campaña
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Inversión del artista
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
            {formatCurrency(inversionDelArtista)}
          </div>
          <div className="mt-0.5 text-xs text-slate-400">Gasto real (payer artista/compartido)</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Presupuesto activo
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-slate-800">
            {formatCurrency(presupuestoActivo)}
          </div>
          <div className="mt-0.5 text-xs text-slate-400">Aprobadas + activas</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Campañas activas
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-emerald-600">{activas}</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ApxDd
          todas="Todos los artistas"
          opciones={ARTISTAS_MANAGEMENT}
          valor={artista}
          onCambio={setArtista}
          ancho="w-48"
        />
        <ApxDd
          todas="Todos los canales"
          opciones={CANALES_CAMPANA}
          valor={canal}
          onCambio={setCanal}
          ancho="w-44"
        />
        <ApxDd
          todas="Todos los estados"
          opciones={ESTADOS_CAMPANA}
          valor={estado}
          onCambio={setEstado}
          ancho="w-40"
        />
        <span className="ml-auto text-xs text-slate-400">{contador(visibles.length)}</span>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Campaña
              </th>
              <th className="w-[120px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Canal
              </th>
              <th className="w-[104px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Estado
              </th>
              <th className="w-[84px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Paga
              </th>
              <th className="w-[150px] px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Gasto / Presupuesto
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Sin campañas.
                </td>
              </tr>
            ) : (
              visibles.map((campana) => (
                <tr key={campana.nombre} className="group hover:bg-slate-50">
                  <td className="px-3 py-2.5 align-middle">
                    {/* En el live abre el modal `Editar campaña` — Fase G. */}
                    <button type="button" className="min-w-0 text-left">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate font-medium text-slate-800">
                          {campana.nombre}
                        </span>
                      </div>
                      <span className="truncate text-xs text-slate-400">
                        {campana.fecha ? `${campana.artista} · ${campana.fecha}` : campana.artista}
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-slate-500">
                    {campana.canal}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <span className={`badge ${PALETA[campana.estado]}`}>{campana.estado}</span>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-slate-500">
                    {campana.paga}
                  </td>
                  <td className="px-3 py-2.5 text-right align-middle">
                    <div className="tabular-nums text-slate-700">
                      {formatCurrency(campana.gasto)}{' '}
                      <span className="text-slate-400">
                        / {formatCurrency(campana.presupuesto)}
                      </span>
                    </div>
                    <div className="ml-auto mt-1 h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-400"
                        style={{
                          // En la captura las once barras están a 0 %: o no hay
                          // gasto, o no hay presupuesto contra el que medirlo.
                          width: `${
                            campana.presupuesto > 0
                              ? Math.min(100, (campana.gasto / campana.presupuesto) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
