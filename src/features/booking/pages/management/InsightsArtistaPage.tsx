import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  CHIP_ESTADO,
  COLOR_HITO,
  COLOR_HITO_POR_DEFECTO,
  FICHAS,
  KPIS_OVERVIEW,
  ORDENES_TOP_TRACKS,
  PUNTO_ESTADO,
  RANGOS,
  VACIO,
  type CiudadOyentes,
  type FichaArtista,
  type Hito,
  type OrdenTopTracks,
  type PestanaPlataforma,
  type Pista,
  type PuntoSerie,
  type RangoGrafico,
} from '@/features/booking/data/management-insights-ficha';
import {
  MAPAMUNDI_ASPECTO,
  MAPAMUNDI_GROSOR,
  MAPAMUNDI_PAISES,
  MAPAMUNDI_RELLENO,
  MAPAMUNDI_TRAZO,
  MAPAMUNDI_VIEWBOX,
} from '@/features/booking/data/mapamundi';

/**
 * `/management/insights/:artistaId` — la ficha completa de un artista.
 *
 * Se llega pulsando una fila de `/management/insights`, cuyo pie lo anuncia
 * literal: «Pulsa un artista para su ficha completa». Calco del live capturado
 * el 2026-09-09; la evidencia y las reglas medidas están documentadas en
 * `management-insights-ficha.ts`, que es donde hay que mirar antes de tocar
 * nada de aquí.
 *
 * Tres cosas que se midieron y no se deben "arreglar" sin volver al live:
 *
 * - **Las pestañas no cambian la URL.** Son estado de cliente: al recargar se
 *   vuelve a `Overview`. No es un olvido, es lo que hace el live.
 * - **`Sincronizar` es inerte.** Es una acción sobre un servicio externo, así
 *   que se calca su aspecto y no se cablea, igual que los exports.
 * - **Una pestaña de plataforma existe si alguno de sus propios KPI no vale
 *   cero** —no basta con que la fuente tenga histórico— y si además no hay serie
 *   para su métrica, **desaparece la tarjeta del gráfico**, no se pinta vacía.
 */
export function InsightsArtistaPage() {
  const { artistaId } = useParams();
  const ficha = useMemo(
    () => FICHAS.find((f) => f.id === artistaId) ?? fichaSinSincronizar(artistaId),
    [artistaId]
  );
  const pestanas = useMemo(() => nombresDePestanas(ficha), [ficha]);
  const [activa, setActiva] = useState(0);
  const actual = pestanas[activa] ?? 'Overview';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* El live pinta un botón; aquí es un enlace real, como ya hacía el stub. */}
          <Link to="/management/insights" className="btn-secondary text-sm">
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-800">{ficha.nombre}</h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${CHIP_ESTADO[ficha.estado]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${PUNTO_ESTADO[ficha.estado]}`} />
                {ficha.estado}
              </span>
            </div>
            <p className="text-xs text-slate-400">Songstats · actualizado {ficha.actualizado}</p>
          </div>
        </div>
        {/* Inerte a propósito: dispara una sincronización con Songstats. */}
        <button type="button" className="btn-primary text-sm disabled:opacity-50">
          Sincronizar
        </button>
      </div>

      <div className="mb-4 overflow-x-auto border-b border-slate-200">
        <div className="flex gap-1">
          {pestanas.map((nombre, i) => (
            <button
              key={nombre}
              type="button"
              onClick={() => setActiva(i)}
              aria-current={i === activa ? 'page' : undefined}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition ${
                i === activa
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {actual === 'Overview' && <Overview ficha={ficha} />}
        {actual === 'Audiencia' && <Audiencia ciudades={ficha.ciudades} />}
        {plataformaDe(ficha, actual) && (
          <Plataforma ficha={ficha} pestana={plataformaDe(ficha, actual)!} />
        )}
      </div>
    </div>
  );
}

/**
 * La ficha de un artista que no capturamos.
 *
 * No es un «no encontrado»: es **la plantilla de fallo de sincronización que el
 * propio live produce**, medida sobre Sebastian Ledher, cuya llamada a Songstats
 * devolvió `HTTP 429`. Nueve KPI a `—`, una sola pestaña y «Sin datos.» en los
 * bloques. Se prefirió un estado real poco representativo a uno inventado
 * verosímil; el porqué está en la cabecera del fichero de datos.
 */
function fichaSinSincronizar(id: string | undefined): FichaArtista {
  const plantilla = FICHAS.find((f) => f.fallo)!;
  return { ...plantilla, id: id ?? plantilla.id, nombre: nombreDe(id) };
}

/** Del slug del listado al nombre: `dh-moon` → `DH Moon` no se puede deducir, así que se calca el slug. */
function nombreDe(id: string | undefined): string {
  if (!id) return '—';
  return id
    .split('-')
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(' ');
}

/**
 * Las pestañas de un artista: `Overview` siempre, `Audiencia` si tiene ciudades,
 * y una por plataforma que supere la regla medida (algún KPI propio distinto de
 * cero), en el orden canónico que ya trae el dato.
 */
function nombresDePestanas(ficha: FichaArtista): string[] {
  return [
    'Overview',
    ...(ficha.ciudades.length ? ['Audiencia'] : []),
    ...ficha.plataformas.map((p) => p.nombre),
  ];
}

function plataformaDe(ficha: FichaArtista, nombre: string): PestanaPlataforma | undefined {
  return ficha.plataformas.find((p) => p.nombre === nombre);
}

function Overview({ ficha }: { ficha: FichaArtista }) {
  return (
    <>
      <Kpis kpis={KPIS_OVERVIEW.map((label, i) => ({ label, valor: ficha.kpis[i] }))} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TopTracks ficha={ficha} />
        <ListaDeHitos titulo="Hitos recientes" hitos={ficha.hitos} />
      </div>
      {ficha.releases.length > 0 && <Releases ficha={ficha} />}
    </>
  );
}

function Kpis({ kpis }: { kpis: Array<{ label: string; valor: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((k) => (
        <div key={k.label} className="card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {k.label}
          </div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-slate-800">{k.valor}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * `TOP TRACKS` con sus tres ordenaciones.
 *
 * El conmutador **no reordena la misma lista: cambia el conjunto**, porque cada
 * ordenación sólo trae las pistas que tienen ese dato. Medido en Janse: 8 pistas
 * por `Streams`, 12 por `Popularidad` y 14 por `Playlist reach`.
 */
function TopTracks({ ficha }: { ficha: FichaArtista }) {
  const [orden, setOrden] = useState<OrdenTopTracks>('Streams');
  const pistas = ficha.topTracks[orden];
  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top tracks</h2>
        <Conmutador
          opciones={ORDENES_TOP_TRACKS}
          activa={orden}
          onElegir={setOrden}
          tamano="text-[11px]"
        />
      </div>
      {pistas.length ? <ListaDePistas pistas={pistas} /> : <Vacio />}
    </div>
  );
}

function ListaDePistas({ pistas }: { pistas: Pista[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {pistas.map((p) => (
        <li key={`${p.pos}-${p.url}`} className="flex items-center gap-2.5 py-1.5 text-sm">
          <span className="w-4 shrink-0 text-right text-xs text-slate-400">{p.pos}</span>
          <img src={p.portada} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-slate-800">
              <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">
                {p.titulo}
              </a>
            </div>
            <div className="truncate text-xs text-slate-400">{p.artistas}</div>
          </div>
          <span className="shrink-0 tabular-nums text-slate-500">{p.valor}</span>
        </li>
      ))}
    </ul>
  );
}

function ListaDeHitos({ titulo, hitos }: { titulo: string; hitos: Hito[] }) {
  return (
    <div className="card p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {titulo}
      </h2>
      {hitos.length ? (
        <ul className="divide-y divide-slate-100">
          {hitos.map((h, i) => (
            <li key={`${h.texto}-${i}`} className="flex items-center gap-2.5 py-2 text-sm">
              <img src={h.portada} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-800">
                  <a href={h.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {h.texto}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 truncate text-xs text-slate-400">
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: COLOR_HITO[h.fuente] ?? COLOR_HITO_POR_DEFECTO }}
                  />
                  {h.pista}
                </div>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{h.fecha}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Vacio />
      )}
    </div>
  );
}

function Releases({ ficha }: { ficha: FichaArtista }) {
  return (
    <div className="card p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Releases</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ficha.releases.map((r, i) => (
          <div
            key={`${r.titulo}-${i}`}
            className="flex items-baseline justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-slate-800">{r.titulo}</div>
              {/* El origen no trae sello: el live pinta un guion. */}
              <div className="truncate text-xs text-slate-400">{r.sello ?? '—'}</div>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{r.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Vacio() {
  return <p className="py-4 text-center text-xs text-slate-300">{VACIO}</p>;
}

function Conmutador<T extends string>({
  opciones,
  activa,
  onElegir,
  tamano,
}: {
  opciones: readonly T[];
  activa: T;
  onElegir: (valor: T) => void;
  /**
   * Los dos tamaños que usa el live: `text-[11px]` en los conmutadores de
   * bloque y `text-xs` en el de rango del gráfico. Van como clases enteras a
   * propósito — Tailwind no ve las que se construyen interpolando.
   */
  tamano: 'text-[11px]' | 'text-xs';
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
      {opciones.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onElegir(o)}
          className={`rounded-md px-2 py-1 ${tamano} font-medium transition ${
            o === activa
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Una pestaña de plataforma: gráfico (si hay serie), KPI y los bloques propios. */
function Plataforma({ ficha, pestana }: { ficha: FichaArtista; pestana: PestanaPlataforma }) {
  return (
    <>
      {pestana.metrica && <Grafico pestana={pestana} />}
      <Kpis kpis={pestana.kpis} />
      {pestana.clave === 'spotify' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <TopTracks ficha={ficha} />
          <TopPlaylists ficha={ficha} />
        </div>
      )}
      {pestana.clave === 'beatport' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Top tracks{' '}
              <span className="text-[10px] font-normal normal-case text-slate-400">(dj charts)</span>
            </h2>
            {ficha.beatportTracks.length ? (
              <ListaDePistas pistas={ficha.beatportTracks} />
            ) : (
              <Vacio />
            )}
          </div>
          {ficha.beatportCharts.length > 0 && (
            <ListaDeHitos titulo="Charts recientes" hitos={ficha.beatportCharts} />
          )}
        </div>
      )}
    </>
  );
}

function TopPlaylists({ ficha }: { ficha: FichaArtista }) {
  return (
    <div className="card p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Top playlists
      </h2>
      {ficha.topPlaylists.length ? (
        <ul className="divide-y divide-slate-100">
          {ficha.topPlaylists.map((p) => (
            <li key={p.url} className="flex items-center gap-2.5 py-1.5 text-sm">
              <img src={p.portada} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-slate-700 hover:underline"
              >
                {p.nombre}
              </a>
              <span className="shrink-0 tabular-nums text-slate-500">{p.seguidores}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Vacio />
      )}
    </div>
  );
}

const ANCHO = 640;
const ALTO = 240;
const MARGEN = 4;

/**
 * El área y la línea del gráfico, con la geometría del live.
 *
 * Medida contra 33 gráficos capturados y **reproducida punto por punto**: caja
 * de 640×240 con margen 4, `x` repartida a partes iguales entre los puntos e
 * `y` normalizada entre el mínimo y el máximo **de la ventana**, con un decimal.
 * El área es la misma línea cerrada contra el suelo.
 */
function trazado(serie: PuntoSerie[]): { linea: string; area: string } {
  const vals = serie.map((p) => p.valor);
  const lo = Math.min(...vals);
  const rango = Math.max(...vals) - lo || 1;
  const paso = serie.length > 1 ? (ANCHO - MARGEN * 2) / (serie.length - 1) : 0;
  const puntos = serie.map((p, i) => {
    const x = MARGEN + (serie.length > 1 ? i * paso : (ANCHO - MARGEN * 2) / 2);
    const y = ALTO - MARGEN - ((p.valor - lo) / rango) * (ALTO - MARGEN * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linea = puntos.map((p, i) => (i ? `L${p}` : `M${p}`)).join(' ');
  return {
    linea,
    area: `${linea} L${(ANCHO - MARGEN).toFixed(1)},${ALTO - MARGEN} L${MARGEN.toFixed(1)},${ALTO - MARGEN} Z`,
  };
}

/** `Todo` no recorta; el resto se lleva la cola de N días desde el último punto. */
function recorta(serie: PuntoSerie[], rango: RangoGrafico): PuntoSerie[] {
  const dias = RANGOS.find((r) => r.etiqueta === rango)?.dias;
  if (!dias || !serie.length) return serie;
  const fin = Date.parse(serie[serie.length - 1].fecha + 'T00:00:00Z');
  const desde = fin - dias * 86_400_000;
  return serie.filter((p) => Date.parse(p.fecha + 'T00:00:00Z') >= desde);
}

/** `137.1K` / `9.7M` / `289` — el formateador del live, deducido de 24 pares. */
function formatea(v: number): string {
  const abs = Math.abs(v);
  if (abs < 1000) return String(Math.trunc(v));
  const [n, sufijo] = abs >= 1e6 ? [v / 1e6, 'M'] : [v / 1000, 'K'];
  return n.toFixed(1).replace(/\.0$/, '') + sufijo;
}

/**
 * El delta del periodo: `+58.5K · +83.4% en el periodo`.
 *
 * Medido: **el porcentaje se omite cuando el primer punto vale cero** (no hay
 * base sobre la que calcularlo) y **la línea entera desaparece cuando no hay
 * variación**. No es un caso raro: pasa en cuatro de los treinta y tres
 * gráficos capturados.
 */
function delta(serie: PuntoSerie[]): { texto: string; sube: boolean } | null {
  if (serie.length < 2) return null;
  const base = serie[0].valor;
  const d = serie[serie.length - 1].valor - base;
  if (d === 0) return null;
  const signo = d > 0 ? '+' : '-';
  const pct = base ? ` · ${signo}${Math.abs((d / base) * 100).toFixed(1)}%` : '';
  return { texto: `${signo}${formatea(Math.abs(d))}${pct} en el periodo`, sube: d > 0 };
}

function Grafico({ pestana }: { pestana: PestanaPlataforma }) {
  const [rango, setRango] = useState<RangoGrafico>('Todo');
  const serie = useMemo(() => recorta(pestana.serie, rango), [pestana.serie, rango]);
  const d = delta(serie);
  const { linea, area } = trazado(serie);
  const ultimo = pestana.serie[pestana.serie.length - 1];

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-700">
            {pestana.nombre} — {pestana.metrica}
          </div>
          <div className="flex items-baseline gap-2">
            {/* La cifra grande es la del último punto de la serie entera: no cambia con el rango. */}
            <span className="text-2xl font-bold tabular-nums text-slate-800">
              {formatea(ultimo.valor)}
            </span>
            {d && (
              <span
                className={`text-xs tabular-nums ${d.sube ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {d.texto}
              </span>
            )}
          </div>
        </div>
        <Conmutador
          opciones={RANGOS.map((r) => r.etiqueta)}
          activa={rango}
          onElegir={setRango}
          tamano="text-xs"
        />
      </div>
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: `${ALTO}px` }}
        role="img"
        aria-label={`${pestana.nombre} — ${pestana.metrica}`}
      >
        <path d={area} fill={pestana.color} opacity="0.08" />
        <path
          d={linea}
          fill="none"
          stroke={pestana.color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const CIUDADES_EN_TABLA = 25;
const PAISES_EN_BARRAS = 12;

/**
 * La pestaña `Audiencia`: mapa de burbujas, tabla de ciudades y barras por país.
 *
 * El conmutador `Actual` / `Pico` cambia **qué ciudades salen y su radio**, no
 * sólo el número: medido en Janse, 45 burbujas en `Actual` y 71 en `Pico`,
 * porque en `Actual` sólo entran las que tienen oyentes hoy.
 */
function Audiencia({ ciudades }: { ciudades: CiudadOyentes[] }) {
  const [modo, setModo] = useState<'Actual' | 'Pico'>('Actual');
  const valor = useCallback(
    (c: CiudadOyentes) => (modo === 'Actual' ? c.actual : c.pico),
    [modo]
  );
  const burbujas = useMemo(
    () => ciudades.filter((c) => valor(c) > 0).sort((a, b) => valor(b) - valor(a)),
    [ciudades, valor]
  );
  const tabla = useMemo(
    () => [...ciudades].sort((a, b) => b.actual - a.actual).slice(0, CIUDADES_EN_TABLA),
    [ciudades]
  );
  const paises = useMemo(() => {
    const suma = new Map<string, number>();
    for (const c of ciudades) suma.set(c.pais, (suma.get(c.pais) ?? 0) + c.actual);
    return [...suma.entries()]
      .map(([codigo, oyentes]) => ({ codigo, oyentes }))
      .sort((a, b) => b.oyentes - a.oyentes)
      .slice(0, PAISES_EN_BARRAS);
  }, [ciudades]);
  const techo = paises[0]?.oyentes || 1;

  return (
    <>
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Oyentes por ciudad — mapa
          </h2>
          <Conmutador
            opciones={['Actual', 'Pico'] as const}
            activa={modo}
            onElegir={setModo}
            tamano="text-[11px]"
          />
        </div>
        <Mapa burbujas={burbujas} valor={valor} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Oyentes por ciudad (Spotify)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[10px] uppercase tracking-wide text-slate-400">
                  <th className="py-1.5 pr-2">Ciudad</th>
                  <th className="px-2 py-1.5 text-right">Actual</th>
                  <th className="px-2 py-1.5 text-right">Pico</th>
                  <th className="py-1.5 pl-2 text-right">Fecha pico</th>
                </tr>
              </thead>
              <tbody>
                {tabla.map((c) => (
                  <tr key={`${c.nombre}-${c.pais}`}>
                    <td className="py-1.5 pr-2 text-slate-700">
                      {c.nombre}
                      <span className="ml-1 text-xs text-slate-400">{c.pais}</span>
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums text-slate-800">
                      {formatea(c.actual)}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums text-slate-400">
                      {formatea(c.pico)}
                    </td>
                    <td className="py-1.5 pl-2 text-right text-xs text-slate-400">{c.fechaPico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Oyentes por país
          </h2>
          <div className="space-y-2">
            {paises.map((p) => (
              <div key={p.codigo} className="flex items-center gap-2.5">
                <span className="w-8 shrink-0 text-xs font-medium uppercase text-slate-500">
                  {p.codigo}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((p.oyentes / techo) * 100)}%`,
                      background: 'rgb(91, 75, 232)',
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-slate-500">
                  {formatea(p.oyentes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Radio de la burbuja: 3 px de suelo y 26 más para la ciudad mayor. */
const RADIO_MINIMO = 3;
const RADIO_EXTRA = 26;

/**
 * El mapa de burbujas.
 *
 * Los trazados de país son literales del live (ver `mapamundi.ts`), y **la
 * proyección y el radio también lo son: se dedujeron y se verificaron**, no se
 * inventaron. Del volcado sólo se leen las coordenadas ya proyectadas, así que
 * al principio se dieron por «nuestras» —como la de `EsquemaRuta` en
 * `TourDetallePage`— pero contrastando las burbujas contra las
 * `city_lat`/`city_lng` del origen salieron exactas:
 *
 * - **Proyección equirectangular** sobre el mismo `viewBox` de 1000×500:
 *   `x = (lng + 180) / 360 · 1000` y `y = (90 − lat) / 180 · 500`. Verificada en
 *   las **137 burbujas** de los cuatro artistas con audiencia.
 * - **Radio** `3 + 26 · √(v / máximo)`, con `v` el valor del modo activo.
 *   Verificado en las mismas 137, con desviación **cero**.
 *
 * Por eso las coordenadas van a precisión completa en el fichero de datos:
 * redondearlas a cuatro decimales ya desplazaba alguna burbuja 0,16 px.
 */
function Mapa({
  burbujas,
  valor,
}: {
  burbujas: CiudadOyentes[];
  valor: (c: CiudadOyentes) => number;
}) {
  const techo = burbujas.length ? valor(burbujas[0]) : 1;
  return (
    <svg
      viewBox={MAPAMUNDI_VIEWBOX}
      className="w-full rounded-lg bg-slate-50"
      style={{ aspectRatio: MAPAMUNDI_ASPECTO }}
      role="img"
      aria-label="Oyentes por ciudad"
    >
      {MAPAMUNDI_PAISES.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={MAPAMUNDI_RELLENO}
          stroke={MAPAMUNDI_TRAZO}
          strokeWidth={MAPAMUNDI_GROSOR}
        />
      ))}
      {burbujas.map((c) => (
        <circle
          key={`${c.nombre}-${c.pais}`}
          cx={((c.lng + 180) / 360) * 1000}
          cy={((90 - c.lat) / 180) * 500}
          r={RADIO_MINIMO + RADIO_EXTRA * Math.sqrt(valor(c) / techo)}
          fill="#5B4BE8"
          fillOpacity="0.4"
          stroke="#5B4BE8"
          strokeOpacity="0.7"
          strokeWidth="0.6"
        >
          <title>{`${c.nombre} (${c.pais}): ${formatea(valor(c))}`}</title>
        </circle>
      ))}
    </svg>
  );
}
