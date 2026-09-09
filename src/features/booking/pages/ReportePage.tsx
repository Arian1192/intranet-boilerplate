import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  PESTANAS_REPORTE,
  ESTADOS_REPORTE,
  formatEurosReporte,
  datosReporte,
  COLOR_BOOKING,
  COLOR_MANAGEMENT,
  CABECERAS_AGENTES,
  NOTA_AGENTES,
  artistasSelect,
  PLACEHOLDER_VISTA_ARTISTA,
  VACIO_VISTA_ARTISTA,
  kpisComisiones,
  comisionesPorAgente,
  cargaPorPersona,
  ROLES_REPARTO,
  repartoPorArtista,
  artistasSinAsignar,
  inicialesPersona,
  type DatosReporte,
  type KpiReporte,
  type PestanaReporte,
  type PersonaChip,
} from '../data/reporte';

/** El icono de calendario del botón `dp-btn` del live. */
function IconoCalendario() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

/**
 * Selector de fecha de la carcasa. Va **cerrado e inerte**: el calendario
 * (`dp-pop`) no se llegó a abrir en la captura, así que sólo se calca el estado
 * que hay en la foto.
 */
function SelectorFecha({ etiqueta }: { etiqueta: string }) {
  return (
    <div>
      <span className="label block">{etiqueta}</span>
      <div className="dp">
        <button type="button" className="dp-btn" aria-label={etiqueta}>
          <IconoCalendario />
          <span className="dp-lab ph">dd/mm/aaaa</span>
        </button>
      </div>
    </div>
  );
}

function TarjetaKpi({ kpi }: { kpi: KpiReporte }) {
  return (
    <div role="group" aria-label={`KPI ${kpi.etiqueta}`} className="card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {kpi.etiqueta}
      </div>
      <div className={cn('mt-2 truncate text-2xl font-bold', kpi.clase)} title={kpi.valor}>
        {kpi.valor}
      </div>
      {kpi.pies && (
        <div className="mt-1 text-xs text-slate-400">
          {kpi.pies.map((pie) => (
            <span key={pie} className="block">
              {pie}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Columnas apiladas de dos series. Es el único gráfico de la ronda con más de
 * una serie, así que lleva leyenda; los colores van literales porque así los
 * emite el SVG del live.
 */
function GraficoApilado({ datos }: { datos: DatosReporte }) {
  const { feesPorArtista, ticksFees } = datos;
  const max = ticksFees[ticksFees.length - 1];
  return (
    <div className="card mt-4 p-5">
      <section aria-label="Fees por artista (Booking + Management apilados)">
        <h3 className="mb-4 text-sm font-medium text-slate-600">
          Fees por artista (Booking + Management apilados)
        </h3>
        <div className="mb-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_BOOKING }}
              aria-hidden="true"
            />
            Booking
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_MANAGEMENT }}
              aria-hidden="true"
            />
            Management
          </span>
        </div>
        <div className="flex h-72 gap-2">
          <div className="flex w-20 shrink-0 flex-col-reverse justify-between pb-10 text-right text-[11px] tabular-nums text-slate-500">
            {ticksFees.map((tick) => (
              <span key={tick}>{formatEurosReporte(tick)}</span>
            ))}
          </div>
          <div className="relative flex flex-1 items-end gap-2 border-b border-slate-200 pb-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-10 top-0 flex flex-col justify-between"
            >
              {ticksFees.map((tick) => (
                <div key={tick} className="border-t border-dashed border-slate-100" />
              ))}
            </div>
            {feesPorArtista.map((fee) => (
              <div
                key={fee.artista}
                className="relative z-10 flex h-full flex-1 flex-col justify-end"
                title={`${fee.artista} · Booking ${formatEurosReporte(fee.booking)} · Management ${formatEurosReporte(fee.management)}`}
              >
                {fee.management > 0 && (
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(fee.management / max) * 100}%`,
                      backgroundColor: COLOR_MANAGEMENT,
                    }}
                  />
                )}
                <div
                  className={cn('w-full', fee.management === 0 && 'rounded-t')}
                  style={{
                    height: `${(fee.booking / max) * 100}%`,
                    backgroundColor: COLOR_BOOKING,
                  }}
                />
                <span className="absolute -bottom-10 w-full truncate text-center text-[10px] text-slate-500">
                  {fee.artista}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GraficoComisiones({ datos }: { datos: DatosReporte }) {
  const { tablaAgentes, ticksComision } = datos;
  const max = ticksComision[ticksComision.length - 1];
  return (
    <div className="card mt-4 p-5">
      <section aria-label="Comisión generada por agente">
        <h3 className="mb-4 text-sm font-medium text-slate-600">Comisión generada por agente</h3>
        <div className="flex h-64 gap-2">
          <div className="flex w-20 shrink-0 flex-col-reverse justify-between pb-10 text-right text-[11px] tabular-nums text-slate-500">
            {ticksComision.map((tick) => (
              <span key={tick}>{formatEurosReporte(tick)}</span>
            ))}
          </div>
          <div className="relative flex flex-1 items-end gap-4 border-b border-slate-200 pb-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-10 top-0 flex flex-col justify-between"
            >
              {ticksComision.map((tick) => (
                <div key={tick} className="border-t border-dashed border-slate-100" />
              ))}
            </div>
            {tablaAgentes.map((fila) => (
              <div
                key={fila.agente}
                className="relative z-10 flex h-full flex-1 flex-col justify-end"
                title={`${fila.agente}: ${formatEurosReporte(fila.comision)}`}
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${(fila.comision / max) * 100}%`,
                    backgroundColor: COLOR_BOOKING,
                  }}
                />
                <span className="absolute -bottom-10 w-full truncate text-center text-[10px] text-slate-500">
                  {fila.agente}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Pastilla de persona del reparto: iniciales, nunca la foto (ver `/artistas`). */
function PastillaPersona({ persona }: { persona: PersonaChip }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-0.5 pl-0.5 pr-2 text-sm text-slate-700">
      <span
        className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
        aria-label={persona.completo}
        style={{ width: 22, height: 22, backgroundColor: COLOR_BOOKING, fontSize: 9 }}
      >
        {inicialesPersona(persona.completo)}
      </span>
      {persona.corto}
      <button type="button" className="text-slate-400 hover:text-red-500" aria-label="Quitar">
        ✕
      </button>
    </span>
  );
}

function BotonAnadir() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-100"
    >
      <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border border-dashed border-slate-300">
        ＋
      </span>
      Añadir
    </button>
  );
}

export function ReportePage() {
  const [pestana, setPestana] = useState<PestanaReporte>('Resumen');
  const [estado, setEstado] = useState(ESTADOS_REPORTE[0]);
  const [artista, setArtista] = useState('');
  const [soloSinAsignar, setSoloSinAsignar] = useState(false);

  // El filtro Estado cambia KPI, gráficos y tabla: no es decorativo.
  const datos = useMemo(() => datosReporte(estado), [estado]);
  const sinAsignar = useMemo(() => artistasSinAsignar(repartoPorArtista), []);
  const filasReparto = soloSinAsignar ? sinAsignar : repartoPorArtista;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Analítica</h1>
          <p className="text-sm text-slate-500">
            Uso interno · fees, agentes y comisiones. Importes en EUR.
          </p>
        </div>
        {/* El live sólo enseña estos filtros en la pestaña Resumen. */}
        {pestana === 'Resumen' && (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label" htmlFor="reporte-estado">
                Estado
              </label>
              <select
                id="reporte-estado"
                className="input"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                {ESTADOS_REPORTE.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
            <SelectorFecha etiqueta="Desde" />
            <SelectorFecha etiqueta="Hasta" />
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-1 border-b border-slate-200" role="tablist">
        {PESTANAS_REPORTE.map((opcion) => (
          <button
            key={opcion}
            type="button"
            role="tab"
            aria-selected={pestana === opcion}
            onClick={() => setPestana(opcion)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium',
              pestana === opcion
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {opcion}
          </button>
        ))}
      </div>

      {pestana === 'Resumen' && (
        <div>
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Dashboard general
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {datos.kpisDashboard.map((kpi) => (
                <TarjetaKpi key={kpi.etiqueta} kpi={kpi} />
              ))}
            </div>
            <GraficoApilado datos={datos} />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Por agente
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {datos.kpisPorAgente.map((kpi) => (
                <TarjetaKpi key={kpi.etiqueta} kpi={kpi} />
              ))}
            </div>
            <GraficoComisiones datos={datos} />
            <div className="card mt-4 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                      {CABECERAS_AGENTES.map((cabecera, i) => (
                        <th
                          key={cabecera}
                          className={cn('px-4 py-3 font-medium', i > 0 && 'text-right')}
                        >
                          {cabecera}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {datos.tablaAgentes.map((fila) => (
                      <tr key={fila.agente}>
                        <td className="px-4 py-2 font-medium text-slate-800">{fila.agente}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-600">
                          {fila.cierres}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-600">
                          {formatEurosReporte(fila.feeBruto)}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-500">
                          {formatEurosReporte(fila.feeMedio)}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-600">
                          {formatEurosReporte(fila.bookingFees)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold tabular-nums text-brand-700">
                          {formatEurosReporte(fila.comision)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{NOTA_AGENTES}</p>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2
                className="text-sm font-semibold uppercase tracking-wide text-slate-500"
                id="reporte-vista-artista"
              >
                Vista por artista
              </h2>
              <select
                className="input max-w-[260px]"
                aria-labelledby="reporte-vista-artista"
                value={artista}
                onChange={(e) => setArtista(e.target.value)}
              >
                <option value="">{PLACEHOLDER_VISTA_ARTISTA}</option>
                {artistasSelect.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
            {/*
              El live no se llegó a abrir con un artista elegido, así que el
              detalle no se calca: se queda el vacío que sí está fotografiado.
            */}
            <div className="card py-16 text-center text-slate-400">{VACIO_VISTA_ARTISTA}</div>
          </section>
        </div>
      )}

      {pestana === 'Comisiones de agentes' && (
        <div>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {kpisComisiones.map((kpi) => (
              <TarjetaKpi key={kpi.etiqueta} kpi={kpi} />
            ))}
          </div>
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Por agente
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {comisionesPorAgente.map((fila) => (
                <div
                  key={fila.agente}
                  role="group"
                  aria-label={`Comisión de ${fila.agente}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800">{fila.agente}</div>
                    <div className="text-xs text-slate-400">{fila.pie}</div>
                  </div>
                  <div className="flex items-center gap-5 text-right text-sm">
                    <div>
                      <div className="text-[11px] uppercase text-slate-400">Devengado</div>
                      <div className="font-semibold text-slate-700">
                        {formatEurosReporte(fila.devengado)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase text-slate-400">Abonado</div>
                      <div className="font-semibold text-emerald-600">
                        {formatEurosReporte(fila.abonado)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase text-slate-400">Pendiente</div>
                      <div className="font-bold text-rose-600">
                        {formatEurosReporte(fila.pendiente)}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" className="btn-ghost text-xs">
                      Detalle
                    </button>
                    <button type="button" className="btn-primary text-xs">
                      Registrar abono
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {pestana === 'Reparto de artistas' && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Carga por persona
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {cargaPorPersona.map((grupo) => {
                const max = Math.max(...grupo.filas.map((f) => f.bolos), 0);
                return (
                  <div key={grupo.rol} className="card p-4">
                    <div className="mb-3 flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">{grupo.rol}</h3>
                      <span className="text-xs text-slate-400">{grupo.meta}</span>
                    </div>
                    <ul className="space-y-2">
                      {grupo.filas.map((fila) => (
                        <li key={fila.nombre}>
                          <div className="mb-0.5 flex items-baseline justify-between gap-2">
                            <span className="min-w-0 truncate text-sm text-slate-700">
                              {fila.nombre}
                            </span>
                            <span className="shrink-0 text-sm tabular-nums text-slate-800">
                              <span className="font-semibold">{fila.bolos}</span>{' '}
                              <span className="text-xs text-slate-400">
                                bolos · {fila.artistas} art.
                              </span>
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${max > 0 ? (fila.bolos / max) * 100 : 0}%` }}
                            />
                          </div>
                        </li>
                      ))}
                      {grupo.sinAsignar && (
                        <li className="flex items-center justify-between gap-2 rounded-lg bg-rose-50 px-2.5 py-1.5">
                          <span className="text-sm font-medium text-rose-700">Sin asignar</span>
                          <span className="text-sm tabular-nums text-rose-700">
                            <span className="font-semibold">{grupo.sinAsignar.artistas}</span>{' '}
                            <span className="text-xs opacity-80">
                              art. · {grupo.sinAsignar.bolos} bolos
                            </span>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Por artista
              </h2>
              <button
                type="button"
                aria-pressed={soloSinAsignar}
                onClick={() => setSoloSinAsignar((puesto) => !puesto)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  soloSinAsignar
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                )}
              >
                Solo sin asignar <span className="opacity-70">({sinAsignar.length})</span>
              </button>
            </div>
            <div className="space-y-1.5">
              {filasReparto.map((artistaFila) => (
                <div
                  key={artistaFila.nombre}
                  role="group"
                  aria-label={`Reparto de ${artistaFila.nombre}`}
                  className="grid items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr]"
                >
                  <div className="flex min-w-0 items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="min-w-0 truncate text-left text-sm font-medium text-slate-800 hover:text-brand-700 hover:underline"
                    >
                      {artistaFila.nombre}
                    </button>
                    <span className="flex shrink-0 items-center gap-1">
                      {artistaFila.booking && (
                        <span
                          className="rounded bg-slate-100 px-1 text-[10px] font-semibold text-slate-500"
                          title="Booking"
                        >
                          B
                        </span>
                      )}
                      {artistaFila.management && (
                        <span
                          className="rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-600"
                          title="Management"
                        >
                          M
                        </span>
                      )}
                      {artistaFila.bolos !== null && (
                        <span
                          className="rounded-full bg-brand-50 px-1.5 text-[10px] font-semibold text-brand-700"
                          title="Bolos próximos"
                        >
                          {artistaFila.bolos} 🎫
                        </span>
                      )}
                    </span>
                  </div>
                  {ROLES_REPARTO.map((rol) => (
                    <div key={rol} className="min-w-0 rounded-lg px-1.5 py-1">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {rol}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {artistaFila.roles[rol].map((persona) => (
                          <PastillaPersona key={persona.completo} persona={persona} />
                        ))}
                        <BotonAnadir />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
