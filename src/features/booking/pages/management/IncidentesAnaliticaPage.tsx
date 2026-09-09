import { useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import {
  KPIS_ANALITICA,
  IMPACTO_ECONOMICO,
  LEYENDA_IMPACTO,
  VACIO_IMPACTO,
  CABECERAS_IMPACTO,
  incidentesPorCategoria,
  incidentesPorDepartamento,
  incidentesPorMes,
  MAX_EJE_MES,
  TICKS_EJE_MES,
  resolucionPorSeveridad,
  resolucionPorDepartamento,
  preventables,
  TICKS_EJE_PREVENTABLES,
  counterpartiesRecurrentes,
  abiertosMasDe14Dias,
  lagPorDepartamento,
  formatImporteAnalitica,
  ROSA_BARRA,
  type MediaAnalitica,
  type SerieAnalitica,
} from '../../data/analitica-incidentes';

/** Barra horizontal fina: el patrón que el live repite en tres bloques. */
function BarraHorizontal({
  etiqueta,
  valor,
  max,
  etiquetaClase,
}: {
  etiqueta: React.ReactNode;
  valor: number;
  max: number;
  etiquetaClase?: string;
}) {
  const ancho = max > 0 ? (valor / max) * 100 : 0;
  return (
    <div className="text-sm">
      <div className="mb-0.5 flex items-center justify-between">
        <span className={cn('truncate', etiquetaClase ?? 'text-slate-600')}>{etiqueta}</span>
        <span className="ml-2 shrink-0 font-semibold text-slate-800">{valor}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${ancho}%`, backgroundColor: ROSA_BARRA }}
        />
      </div>
    </div>
  );
}

/**
 * Gráfico de columnas de serie única, como los dos que el live pinta con
 * Recharts: rejilla discontinua recesiva, barras finas con la punta redondeada
 * de 4 px pegadas a la línea base y sin leyenda (el título ya nombra la serie).
 */
function GraficoColumnas({
  datos,
  ticks,
  max,
  alto,
  sufijo = '',
  descripcion,
}: {
  datos: SerieAnalitica[];
  ticks: number[];
  max: number;
  alto: string;
  sufijo?: string;
  descripcion: string;
}) {
  const resumen = datos.map((d) => `${d.etiqueta}: ${d.valor}${sufijo}`).join(', ');
  return (
    <div
      className={cn('flex w-full gap-2', alto)}
      role="img"
      aria-label={`${descripcion} ${resumen}`}
    >
      <div className="flex w-8 shrink-0 flex-col-reverse justify-between py-1 text-right text-[11px] tabular-nums text-slate-500">
        {ticks.map((tick) => (
          <span key={tick}>
            {tick}
            {sufijo}
          </span>
        ))}
      </div>
      <div className="relative flex flex-1 items-end gap-4 border-b border-slate-200 pb-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between"
        >
          {ticks.map((tick) => (
            <div key={tick} className="border-t border-dashed border-slate-100" />
          ))}
        </div>
        {datos.map((dato) => {
          const altura = max > 0 ? Math.min((dato.valor / max) * 100, 100) : 0;
          return (
            <div
              key={dato.etiqueta}
              className="relative z-10 flex h-full flex-1 flex-col justify-end"
            >
              <div
                className="w-full rounded-t"
                style={{ height: `${altura}%`, backgroundColor: ROSA_BARRA }}
                title={`${dato.etiqueta}: ${dato.valor}${sufijo}`}
              />
              <span className="absolute -bottom-6 w-full text-center text-[11px] text-slate-500">
                {dato.etiqueta}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Fila «etiqueta — valor (casos)» de los tres bloques de medias. */
function FilaMedia({ media }: { media: MediaAnalitica }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 text-sm last:border-0">
      <span className="text-slate-600">{media.etiqueta}</span>
      <span className="flex items-baseline gap-2">
        <span className="font-semibold text-slate-800">{media.valor ?? '—'}</span>
        <span className="text-xs text-slate-400">({media.casos})</span>
      </span>
    </div>
  );
}

function TablaImpactoVacia({ titulo }: { titulo: string }) {
  return (
    <div>
      <div className="px-5 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              {CABECERAS_IMPACTO.map((cabecera, i) => (
                <th
                  key={cabecera || 'vacia'}
                  className={cn(
                    'py-2 font-medium',
                    i === 0 && 'px-5',
                    i > 0 && i < CABECERAS_IMPACTO.length - 1 && 'px-2 text-right',
                    i === CABECERAS_IMPACTO.length - 1 && 'px-5 text-right'
                  )}
                >
                  {cabecera}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                {VACIO_IMPACTO}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IncidentesAnaliticaPage() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const maxCategoria = Math.max(...incidentesPorCategoria.map((c) => c.valor));
  const maxDepartamento = Math.max(...incidentesPorDepartamento.map((d) => d.valor));
  const maxCounterparty = Math.max(...counterpartiesRecurrentes.map((c) => c.valor));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link className="text-sm text-slate-400 hover:text-slate-600" to="/management/incidentes">
            ← Volver al panel de incidentes
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-800">Analítica de incidentes</h1>
          <p className="text-sm text-slate-500">
            Patrones, tiempos de resolución, impacto económico y calidad del reporte.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs font-medium text-slate-500" htmlFor="analitica-desde">
            Desde
            <input
              id="analitica-desde"
              type="date"
              className="input mt-1 block"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-slate-500" htmlFor="analitica-hasta">
            Hasta
            <input
              id="analitica-hasta"
              type="date"
              className="input mt-1 block"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS_ANALITICA.map((kpi) => (
            <div
              key={kpi.etiqueta}
              role="group"
              aria-label={`KPI ${kpi.etiqueta}`}
              className="card p-5"
            >
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {kpi.etiqueta}
              </div>
              <div
                className={cn(
                  'mt-2 text-2xl font-bold',
                  kpi.tono === 'rose' ? 'text-rose-700' : 'text-slate-800'
                )}
              >
                {kpi.valor}
              </div>
              {kpi.pie && <div className="mt-0.5 text-xs text-slate-400">{kpi.pie}</div>}
            </div>
          ))}
        </div>

        <section className="card overflow-hidden border-rose-100">
          <div className="border-b border-rose-100 bg-rose-50/60 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-700">
              Impacto económico
            </h2>
            <p className="text-xs text-rose-500/80">{LEYENDA_IMPACTO}</p>
          </div>
          <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-4">
            {IMPACTO_ECONOMICO.map((cifra) => (
              <div key={cifra.etiqueta}>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {cifra.etiqueta}
                </div>
                <div className={cn('mt-1 text-xl font-semibold', cifra.clase)}>
                  {formatImporteAnalitica(cifra.valor)}
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-0 lg:grid-cols-2">
            <TablaImpactoVacia titulo="Por categoría" />
            <div className="border-t border-slate-100 lg:border-l lg:border-t-0">
              <TablaImpactoVacia titulo="Por departamento" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-5" aria-label="Incidentes por categoría">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Incidentes por categoría
            </h2>
            <div className="space-y-2">
              {incidentesPorCategoria.map((dato) => (
                <BarraHorizontal
                  key={dato.etiqueta}
                  etiqueta={dato.etiqueta}
                  valor={dato.valor}
                  max={maxCategoria}
                />
              ))}
            </div>
          </section>

          <section className="card p-5" aria-label="Incidentes por departamento">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Incidentes por departamento
            </h2>
            <div className="space-y-2">
              {incidentesPorDepartamento.map((dato) => (
                <BarraHorizontal
                  key={dato.etiqueta}
                  etiqueta={dato.etiqueta}
                  valor={dato.valor}
                  max={maxDepartamento}
                />
              ))}
            </div>
          </section>
        </div>

        <section className="card p-5" aria-label="Incidentes por mes (fecha de reporte)">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Incidentes por mes (fecha de reporte)
          </h2>
          <GraficoColumnas
            datos={incidentesPorMes}
            ticks={TICKS_EJE_MES}
            max={MAX_EJE_MES}
            alto="h-64"
            descripcion="Incidentes por mes de reporte."
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-5" aria-label="Resolución media por severidad">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Resolución media por severidad
            </h2>
            <div className="space-y-2">
              {resolucionPorSeveridad.map((media) => (
                <FilaMedia key={media.etiqueta} media={media} />
              ))}
            </div>
          </section>

          <section className="card p-5" aria-label="Resolución media por departamento">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Resolución media por departamento
            </h2>
            <div className="space-y-2">
              {resolucionPorDepartamento.map((media) => (
                <FilaMedia key={media.etiqueta} media={media} />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-5" aria-label="Preventables vs no preventables">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Preventables vs no preventables
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              <span className="font-semibold text-rose-700">{preventables.porcentaje}%</span> de{' '}
              {preventables.clasificados} clasificados eran evitables.
            </p>
            <GraficoColumnas
              datos={preventables.porMes}
              ticks={TICKS_EJE_PREVENTABLES}
              max={100}
              alto="h-56"
              sufijo="%"
              descripcion="Porcentaje de incidentes preventables por mes."
            />
          </section>

          <section className="card p-5" aria-label="Counterparties recurrentes">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Counterparties recurrentes
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Promotores, venues y proveedores con más incidentes registrados.
            </p>
            <div className="space-y-2">
              {counterpartiesRecurrentes.map((cp) => (
                <BarraHorizontal
                  key={cp.nombre}
                  etiquetaClase="font-medium text-slate-700"
                  etiqueta={
                    <>
                      {cp.nombre}{' '}
                      <span className="text-xs font-normal text-slate-400">· {cp.tipo}</span>
                    </>
                  }
                  valor={cp.valor}
                  max={maxCounterparty}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card overflow-hidden" aria-label="Abiertos con más de 14 días">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Abiertos con más de 14 días
              </h2>
              <p className="text-xs text-slate-400">
                Cola viva, por owner. Ignora el filtro de fechas.
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {abiertosMasDe14Dias.map((grupo) => (
                <div key={grupo.owner} className="px-5 py-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{grupo.owner}</span>
                    <span className="badge bg-amber-100 text-amber-800">{grupo.total}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {grupo.incidencias.map((incidencia) => (
                      <li
                        key={incidencia.codigo}
                        className="flex items-center justify-between text-sm text-slate-500"
                      >
                        <span className="truncate">
                          <span className="text-slate-400">{incidencia.codigo}</span>{' '}
                          {incidencia.titulo}
                        </span>
                        <span className="ml-2 shrink-0 tabular-nums text-slate-400">
                          {incidencia.dias}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-5" aria-label="Lag medio de reporte por departamento">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Lag medio de reporte por departamento
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Días entre que ocurre y que se reporta. Diagnóstico de cultura de reporte.
            </p>
            <div className="space-y-2">
              {lagPorDepartamento.map((media) => (
                <FilaMedia key={media.etiqueta} media={media} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
