import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  INSIGHTS_ROSTER,
  RESUMEN_INSIGHTS,
  type ArtistaInsight,
  type EstadoInsight,
  type MetricaInsight,
} from '@/features/booking/data/management-insights';

type Columna =
  'nombre' | 'oyentes' | 'followers' | 'streams' | 'youtube' | 'instagram' | 'tiktok' | 'estado';

/** Paleta de cada estado. `Inactivo` no aparece en la captura (0 artistas): va en gris por descarte. */
const PALETA: Record<EstadoInsight, { chip: string; punto: string }> = {
  Escalando: { chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200', punto: 'bg-emerald-500' },
  Creciendo: { chip: 'bg-violet-50 text-violet-700 ring-violet-200', punto: 'bg-violet-500' },
  Estable: { chip: 'bg-amber-50 text-amber-700 ring-amber-200', punto: 'bg-amber-500' },
  'En declive': { chip: 'bg-rose-50 text-rose-700 ring-rose-200', punto: 'bg-rose-500' },
  Inactivo: { chip: 'bg-slate-50 text-slate-500 ring-slate-200', punto: 'bg-slate-400' },
  'Sin datos': { chip: 'bg-slate-50 text-slate-400 ring-slate-200', punto: 'bg-slate-300' },
};

/** Los cinco chips de filtro, en el orden del live. `Sin datos` no es uno de ellos. */
const CHIPS: EstadoInsight[] = ['Escalando', 'Creciendo', 'Estable', 'En declive', 'Inactivo'];

/**
 * Orden de la columna `Estado`, medido pulsando la cabecera en el live: ascendente
 * empieza por `Sin datos` y sigue por `Escalando`. No es alfabético ni por momentum;
 * es el orden en que el origen declara sus estados.
 */
const ORDEN_ESTADO: EstadoInsight[] = [
  'Sin datos',
  'Escalando',
  'Creciendo',
  'Estable',
  'En declive',
  'Inactivo',
];

/** `137.1K` → 137100, `9.7M` → 9700000, `—` → lo último de la lista. */
function valorNumerico({ valor }: MetricaInsight): number {
  const m = /^([\d.,]+)([KM])?$/.exec(valor.replace(/\s/g, ''));
  if (!m) return Number.NEGATIVE_INFINITY;
  const n = Number(m[1].replace(',', '.'));
  return m[2] === 'M' ? n * 1e6 : m[2] === 'K' ? n * 1e3 : n;
}

function clave(artista: ArtistaInsight, columna: Columna): number | string {
  if (columna === 'nombre') return artista.nombre;
  if (columna === 'estado') return ORDEN_ESTADO.indexOf(artista.estado);
  return valorNumerico(artista[columna]);
}

function Celda({ metrica }: { metrica: MetricaInsight }) {
  return (
    <td className="px-3 py-2.5 align-middle">
      <div className="text-right leading-tight">
        <div className="tabular-nums text-slate-800">{metrica.valor}</div>
        {metrica.delta && (
          <div
            className={`text-[11px] tabular-nums ${
              metrica.tono === 'rose' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {metrica.delta}
          </div>
        )}
      </div>
    </td>
  );
}

/**
 * `/management/insights` — calco del live del 2026-09-09.
 *
 * Las cifras son las de esa captura y el live las mueve a diario. El pie de la
 * tabla promete «Pulsa un artista para su ficha completa», y por eso las filas
 * navegan a `/management/insights/:artistaId`.
 */
export function InsightsPage() {
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<EstadoInsight | null>(null);
  const [orden, setOrden] = useState<{ columna: Columna; descendente: boolean }>({
    columna: 'oyentes',
    descendente: true,
  });

  const ordenar = (columna: Columna) =>
    setOrden((previo) =>
      previo.columna === columna
        ? { columna, descendente: !previo.descendente }
        : // El texto empieza ascendente y los números descendentes, como el live.
          { columna, descendente: columna !== 'nombre' }
    );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const filtrados = INSIGHTS_ROSTER.filter(
      (a) => (!q || a.nombre.toLowerCase().includes(q)) && (!filtro || a.estado === filtro)
    );
    return [...filtrados].sort((a, b) => {
      const ka = clave(a, orden.columna);
      const kb = clave(b, orden.columna);
      const cmp =
        typeof ka === 'string' && typeof kb === 'string'
          ? ka.localeCompare(kb, 'es')
          : Number(ka) - Number(kb);
      // A igualdad, por nombre ascendente: también medido en el live.
      return (orden.descendente ? -cmp : cmp) || a.nombre.localeCompare(b.nombre, 'es');
    });
  }, [busqueda, filtro, orden]);

  const cabecera = (columna: Columna, rotulo: string, extra: string) => (
    <th
      onClick={() => ordenar(columna)}
      className={`cursor-pointer select-none px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 hover:text-slate-700 ${extra}`}
    >
      {rotulo}{' '}
      {orden.columna === columna && (
        <span className="ml-0.5" style={{ color: 'var(--accent)' }}>
          {orden.descendente ? '▼' : '▲'}
        </span>
      )}
    </th>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Insights</h1>
          <p className="text-sm text-slate-500">
            Estado de cada artista en streaming y redes (Songstats). Todo se calcula del histórico —
            nada se introduce a mano.
          </p>
        </div>
        <button type="button" className="btn-primary text-sm disabled:opacity-50">
          Sincronizar Songstats
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Oyentes del roster
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-slate-800">
            {RESUMEN_INSIGHTS.oyentesDelRoster}
          </div>
        </div>
        <div className="card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Followers del roster
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-slate-800">
            {RESUMEN_INSIGHTS.followersDelRoster}
          </div>
        </div>
        <div className="card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Con momentum
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-emerald-600">
            {RESUMEN_INSIGHTS.conMomentum}
            <span className="ml-1 text-sm font-normal text-slate-400">escalando / creciendo</span>
          </div>
        </div>
        <div className="card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Requieren atención
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-rose-600">
            {RESUMEN_INSIGHTS.requierenAtencion}
            <span className="ml-1 text-sm font-normal text-slate-400">declive / inactivo</span>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          placeholder="Buscar artista…"
          className="input h-9 w-full max-w-xs"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {CHIPS.map((estado) => {
            const activo = filtro === estado;
            return (
              <button
                key={estado}
                type="button"
                onClick={() => setFiltro(activo ? null : estado)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition ${
                  activo
                    ? `${PALETA[estado].chip} ring-2`
                    : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${PALETA[estado].punto}`} />
                {estado}
                <span className="tabular-nums opacity-60">
                  {INSIGHTS_ROSTER.filter((a) => a.estado === estado).length}
                </span>
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-xs text-slate-400">{RESUMEN_INSIGHTS.contador}</span>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                {cabecera('nombre', 'Artista', '')}
                <th className="w-[80px] select-none px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Tendencia
                </th>
                {cabecera('oyentes', 'Oyentes', 'w-[120px] text-right')}
                {cabecera('followers', 'Followers', 'w-[100px] text-right')}
                {cabecera('streams', 'Streams', 'w-[90px] text-right')}
                {cabecera('youtube', 'YouTube', 'w-[80px] text-right')}
                {cabecera('instagram', 'Instagram', 'w-[80px] text-right')}
                {cabecera('tiktok', 'TikTok', 'w-[76px] text-right')}
                {cabecera('estado', 'Estado', 'w-[120px]')}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibles.map((artista) => (
                <tr
                  key={artista.id}
                  onClick={() => navegar(`/management/insights/${artista.id}`)}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                >
                  <td className="px-3 py-2.5 align-middle font-medium text-slate-800">
                    {artista.nombre}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    {artista.sparkline && (
                      <svg
                        viewBox="0 0 68 22"
                        width="68"
                        height="22"
                        className="inline-block align-middle"
                      >
                        <path
                          d={artista.sparkline.d}
                          fill="none"
                          stroke={
                            artista.sparkline.tono === 'rose' ? 'var(--rose)' : 'var(--accent)'
                          }
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </td>
                  <Celda metrica={artista.oyentes} />
                  <Celda metrica={artista.followers} />
                  <Celda metrica={artista.streams} />
                  <Celda metrica={artista.youtube} />
                  <Celda metrica={artista.instagram} />
                  <Celda metrica={artista.tiktok} />
                  <td className="px-3 py-2.5 align-middle">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                        PALETA[artista.estado].chip
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${PALETA[artista.estado].punto}`}
                      />
                      {artista.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
        <b className="text-slate-500">Cómo se lee:</b> el estado sale del momentum de oyentes
        mensuales a 90 días. <span className="text-emerald-600">Escalando</span> es crecimiento
        fuerte (≥12%); <span className="text-violet-600">Creciendo</span> es sostenido (≥3%);{' '}
        <span className="text-amber-600">Estable</span> es plano;{' '}
        <span className="text-rose-600">En declive</span> cae;{' '}
        <span className="text-slate-500">Inactivo</span> es nivel bajo y sin movimiento. Pulsa un
        artista para su ficha completa.
      </p>
    </div>
  );
}
