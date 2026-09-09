import { useMemo, useState } from 'react';
import { StatCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  liquidaciones as todasLasLiquidaciones,
  liquidacionesKpis,
  agruparPorArtista,
  filtrarLiquidaciones,
  buscarLiquidaciones,
  formatImporteLiquidacion,
  formatFechaLiquidacion,
  formatPosicionNeta,
  badgeEstado,
  OPCIONES_ESTADO,
  type Liquidacion,
  type OpcionEstado,
} from '../data/liquidaciones';

type Vista = 'show' | 'artista';

/**
 * `/liquidaciones` — el estado de dinero de cada show.
 *
 * Calcado de `docs/references/conceptone-v3-2026-09-09/f1-liquidaciones*.*`. Son
 * **dos tablas distintas**: la de 9 columnas por show y la de 5 por artista.
 */
export function LiquidacionesPage() {
  const [vista, setVista] = useState<Vista>('show');
  const [estado, setEstado] = useState<OpcionEstado>('Todos los estados');
  const [busqueda, setBusqueda] = useState('');

  const filas = useMemo(
    () => buscarLiquidaciones(filtrarLiquidaciones(todasLasLiquidaciones, estado), busqueda),
    [estado, busqueda]
  );
  const kpis = useMemo(() => liquidacionesKpis(filas), [filas]);
  const porArtista = useMemo(() => agruparPorArtista(filas), [filas]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Liquidaciones</h1>
        <p className="text-sm text-slate-500">
          Estado de dinero de cada show: cobros del promotor, gastos, y lo liquidado al artista.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="PENDIENTE DE COBRAR"
          value={formatImporteLiquidacion(kpis.pendienteCobrar)}
        />
        <StatCard
          label="GASTOS POR RECUPERAR"
          value={formatImporteLiquidacion(kpis.gastosPorRecuperar)}
        />
        <StatCard
          label="PENDIENTE DE LIQUIDAR"
          value={formatImporteLiquidacion(kpis.pendienteLiquidar)}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Agrupación de liquidaciones"
          className="inline-flex rounded-lg bg-slate-100 p-1 text-sm"
        >
          <ConmutadorVista actual={vista} valor="show" onChange={setVista}>
            Por show
          </ConmutadorVista>
          <ConmutadorVista actual={vista} valor="artista" onChange={setVista}>
            Por artista
          </ConmutadorVista>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input h-9 w-full max-w-xs"
            placeholder="Buscar artista, show, código…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            aria-label="Estado de la liquidación"
            className="input h-9 w-auto"
            value={estado}
            onChange={(e) => setEstado(e.target.value as OpcionEstado)}
          >
            {OPCIONES_ESTADO.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {vista === 'show'
          ? `${filas.length} ${filas.length === 1 ? 'show' : 'shows'}`
          : `${porArtista.length} ${porArtista.length === 1 ? 'artista' : 'artistas'}`}
      </p>

      <div className="card mt-2 overflow-x-auto">
        {vista === 'show' ? (
          <TablaPorShow filas={filas} />
        ) : (
          <TablaPorArtista filas={porArtista} />
        )}
      </div>

      {filas.length === 0 && (
        <p className="mt-3 text-center text-sm text-slate-400">
          Ningún show cuadra con el filtro.
        </p>
      )}
    </div>
  );
}

function ConmutadorVista({
  actual,
  valor,
  onChange,
  children,
}: {
  actual: Vista;
  valor: Vista;
  onChange: (v: Vista) => void;
  children: React.ReactNode;
}) {
  const activo = actual === valor;
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={() => onChange(valor)}
      className={cn(
        'rounded-md px-3 py-1.5 font-medium',
        activo ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      )}
    >
      {children}
    </button>
  );
}

const COLUMNAS_SHOW = [
  'SHOW',
  'FECHA',
  'COBRADO',
  'PEND. COBRAR',
  'A RECUPERAR',
  'NETO ARTISTA',
  'LIQUIDADO',
  'PEND. LIQUIDAR',
  'ESTADO',
];

function TablaPorShow({ filas }: { filas: Liquidacion[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
          {COLUMNAS_SHOW.map((columna, i) => (
            <th
              key={columna}
              className={cn('px-3 py-2 font-medium', i >= 2 && i <= 7 && 'text-right')}
            >
              {columna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila) => (
          // El live navega de aquí a `/shows/:showId`, pero los uuid de las 243
          // filas no están en el DOM (la fila navega por código, no por enlace),
          // así que la fila se queda inerte hasta que exista esa pantalla.
          <tr key={fila.codigo} className="transition-colors hover:bg-slate-50">
            <td className="px-3 py-2.5 align-middle">
              <div className="flex min-w-0 flex-col">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium text-slate-800">{fila.artista}</span>
                  <span className="shrink-0 font-mono text-[10px] text-slate-400">
                    {fila.codigo}
                  </span>
                </span>
                <span className="truncate text-xs text-slate-400">{fila.evento}</span>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-2.5 align-middle text-slate-500">
              {formatFechaLiquidacion(fila.fecha)}
            </td>
            <Importe valor={fila.cobrado} />
            <Importe valor={fila.pendCobrar} className="font-medium text-rose-600" />
            <Importe valor={fila.aRecuperar} />
            <Importe valor={fila.netoArtista} className="font-medium text-slate-800" />
            <Importe valor={fila.liquidado} className="text-slate-600" />
            <Importe valor={fila.pendLiquidar} className="font-medium text-brand-700" />
            <td className="px-3 py-2.5 align-middle">
              <span className={badgeEstado(fila.estado)}>{fila.estado}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Importe({ valor, className }: { valor: number | null; className?: string }) {
  return (
    <td className={cn('px-3 py-2.5 align-middle text-right tabular-nums', className)}>
      {valor === null ? <span className="text-slate-300">—</span> : formatImporteLiquidacion(valor)}
    </td>
  );
}

const COLUMNAS_ARTISTA = ['ARTISTA', 'SHOWS', 'PEND. LIQUIDAR', 'DEUDA VIVA', 'POSICIÓN NETA'];

function TablaPorArtista({ filas }: { filas: ReturnType<typeof agruparPorArtista> }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
          {COLUMNAS_ARTISTA.map((columna, i) => (
            <th key={columna} className={cn('px-3 py-2 font-medium', i > 0 && 'text-right')}>
              {columna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila) => (
          <tr key={fila.artista} className="transition-colors hover:bg-slate-50">
            <td className="px-3 py-2.5 align-middle font-medium text-slate-800">{fila.artista}</td>
            <td className="px-3 py-2.5 align-middle text-right tabular-nums text-slate-500">
              {fila.shows}
            </td>
            <td className="px-3 py-2.5 align-middle text-right font-medium tabular-nums text-slate-800">
              {formatImporteLiquidacion(fila.pendLiquidar)}
            </td>
            <td className="px-3 py-2.5 align-middle text-right tabular-nums">
              {fila.deudaViva === null ? (
                <span className="text-slate-300">—</span>
              ) : (
                <span className="text-rose-600">{formatImporteLiquidacion(fila.deudaViva)}</span>
              )}
            </td>
            <td className="px-3 py-2.5 align-middle text-right font-medium tabular-nums text-brand-700">
              {formatPosicionNeta(fila.posicionNeta)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
