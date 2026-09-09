import { Link, useParams } from 'react-router';
import {
  tourPorId,
  tourPnl,
  tramosDelTour,
  formatFechaTour,
  formatRangoTour,
  formatImporteTour,
  formatHoras,
  formatHueco,
  notaDivisa,
  type Tour,
  type TourShow,
  type LogisticaEstado,
} from '../data/tours';

/**
 * `/tours/:tourId` — el detalle de una gira.
 *
 * Ruta descubierta pulsando las tarjetas de `/tours` el 2026-09-09 y verificada
 * por URL directa. **La pantalla no tiene `h1`**: el nombre de la gira es un
 * campo editable en línea, así que aquí tampoco lo lleva.
 *
 * Evidencia: `docs/references/conceptone-v3-2026-09-09/f1-tours--detalle-*.*`.
 */
export function TourDetallePage() {
  const { tourId } = useParams();
  const tour = tourId ? tourPorId(tourId) : undefined;

  if (!tour) {
    return (
      <div>
        <VolverATours />
        <p className="card p-5 text-sm text-slate-500">Esta gira no existe.</p>
      </div>
    );
  }

  const pnl = tourPnl(tour);
  const tramos = tramosDelTour(tour);
  const km = tramos.reduce((acc, t) => acc + t.km, 0);
  const horas = tramos.reduce((acc, t) => acc + t.horas, 0);
  const importe = (amount: number) => formatImporteTour(amount, tour.moneda);
  const nota = notaDivisa(tour.moneda);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <VolverATours />
        <button type="button" className="btn-secondary text-xs">
          Exportar PDF
        </button>
      </div>

      <CabeceraTour tour={tour} />

      <div
        role="group"
        aria-label="Resumen de la gira"
        className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <KpiTour
          destacado
          label="Neto del artista con la gira"
          valor={importe(pnl.netoArtista)}
          pie={`cachés netos de ${tour.shows.length} shows`}
        />
        <KpiTour
          label="Margen de la agencia"
          valor={importe(pnl.margenAgencia)}
          pie={`booking fee ${importe(pnl.bookingFee)}`}
        />
        <KpiTour
          label="Gastos de tour"
          valor={importe(pnl.gastosArtista + pnl.gastosAgencia)}
          pie="vuelos, hotel, ground…"
        />
        <KpiTour
          label="Traslados"
          valor={`${km} km`}
          pie={
            tramos.length
              ? `${formatHoras(horas)} h en ${tramos.length} tramos`
              : 'sin ruta calculada'
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Itinerario tour={tour} />
          <Ruta tour={tour} />
        </div>

        <div className="space-y-4">
          <GastosDeTour tour={tour} importe={importe} />
          <PnlDetallado tour={tour} importe={importe} />
          {nota && <p className="text-[11px] leading-relaxed text-slate-400">{nota}</p>}
        </div>
      </div>
    </div>
  );
}

function VolverATours() {
  return (
    <Link to="/tours" className="text-slate-500 hover:text-slate-700">
      ← Volver a tours
    </Link>
  );
}

const ESTADOS: Array<[Tour['estado'], string]> = [
  ['planificando', 'Planificando'],
  ['confirmado', 'Confirmado'],
  ['cerrado', 'Cerrado'],
  ['cancelado', 'Cancelado'],
];

function CabeceraTour({ tour }: { tour: Tour }) {
  const rango = formatRangoTour(tour);
  return (
    <div className="card mb-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <input
            aria-label="Nombre del tour"
            defaultValue={tour.nombre}
            className="w-full border-0 bg-transparent p-0 text-2xl font-semibold text-slate-800 focus:outline-none focus:ring-0"
          />
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              {tour.shows.length} {tour.shows.length === 1 ? 'show' : 'shows'}
            </span>
            <span>· {tour.territorio}</span>
            {rango && <span>· {rango}</span>}
          </div>
        </div>
        <select
          aria-label="Estado del tour"
          defaultValue={tour.estado}
          className="select h-9 w-auto"
        >
          {ESTADOS.map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Campo label="Zona / región" valor={tour.territorio} />
        <Campo label="Desde" tipo="date" valor={tour.desde ?? ''} />
        <Campo label="Hasta" tipo="date" valor={tour.hasta ?? ''} />
        <Campo label="Moneda del P&L" valor={tour.moneda} />
      </div>
    </div>
  );
}

function Campo({ label, valor, tipo }: { label: string; valor: string; tipo?: string }) {
  return (
    <div>
      <label className="label" htmlFor={`tour-${label}`}>
        {label}
      </label>
      <input id={`tour-${label}`} type={tipo} className="input" defaultValue={valor} />
    </div>
  );
}

function KpiTour({
  label,
  valor,
  pie,
  destacado,
}: {
  label: string;
  valor: string;
  pie: string;
  destacado?: boolean;
}) {
  return (
    <div className={`card p-4 ${destacado ? 'bg-brand-50 ring-1 ring-brand-100' : ''}`}>
      <div
        className={`text-[11px] font-semibold uppercase tracking-wide ${destacado ? 'text-brand-600' : 'text-slate-400'}`}
      >
        {label}
      </div>
      <div
        className={`mt-0.5 text-xl font-bold ${destacado ? 'text-brand-800' : 'text-slate-800'}`}
      >
        {valor}
      </div>
      <div className="mt-0.5 text-[11px] text-slate-400">{pie}</div>
    </div>
  );
}

function Itinerario({ tour }: { tour: Tour }) {
  const tramos = tramosDelTour(tour);
  return (
    <section aria-label="Itinerario" className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Itinerario</h2>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary text-xs">
            + Promo
          </button>
          <button type="button" className="btn-secondary text-xs">
            + Añadir show
          </button>
        </div>
      </div>

      {tour.shows.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Itinerario vacío. Añade los shows del artista para ver fechas, traslados y logística.
        </p>
      ) : (
        <div className="space-y-2">
          {tour.shows.map((show, i) => (
            <div key={show.id}>
              {i > 0 && <Tramo tramo={tramos[i - 1]} />}
              <ParadaItinerario show={show} moneda={tour.moneda} />
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Toca las casillas de logística para ciclar ○ pendiente → • reservado → ✓ confirmado. Moneda
        de cada caché en su divisa.
      </p>
    </section>
  );
}

function Tramo({ tramo }: { tramo: ReturnType<typeof tramosDelTour>[number] }) {
  const hueco = formatHueco(tramo.huecoDias);
  return (
    <div className="flex items-center gap-2 py-1 pl-3 text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true">✈️</span>
        <span>{`${tramo.km} km · ${tramo.millas} mi · ≈ ${formatHoras(tramo.horas)} h`}</span>
        {hueco && <span>{hueco}</span>}
      </span>
    </div>
  );
}

const SIMBOLO_LOGISTICA: Record<LogisticaEstado, string> = {
  pendiente: '○',
  reservado: '•',
  confirmado: '✓',
};

const ESTILO_LOGISTICA: Record<LogisticaEstado, string> = {
  pendiente: 'border-slate-200 bg-white text-slate-400',
  reservado: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmado: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const LOGISTICA: Array<[keyof TourShow['logistica'], string]> = [
  ['vuelo', 'Vuelo'],
  ['hotel', 'Hotel'],
  ['ground', 'Ground'],
  ['visado', 'Visado'],
];

function ParadaItinerario({ show, moneda }: { show: TourShow; moneda: string }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <div className="w-14 shrink-0 text-center">
          <div className="text-xs font-semibold text-slate-700">{formatFechaTour(show.fecha)}</div>
          <div className="text-[10px] text-slate-400">{show.fecha.slice(0, 4)}</div>
        </div>
        <Link
          to={`/shows/${show.id}`}
          className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 hover:text-brand-600"
        >
          {show.ciudad}
          <span className="ml-1 text-xs font-normal text-slate-400">· {show.venue}</span>
        </Link>
        <span className="shrink-0 text-sm text-slate-600">
          {formatImporteTour(show.cache, moneda)}
        </span>
        <button
          type="button"
          title="Quitar del tour"
          className="shrink-0 text-slate-300 hover:text-rose-500"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 pl-14">
        {LOGISTICA.map(([clave, label]) => {
          const estado = show.logistica[clave];
          return (
            <button
              key={clave}
              type="button"
              title={`${label}: ${estado}`}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium hover:opacity-80 ${ESTILO_LOGISTICA[estado]}`}
            >
              {SIMBOLO_LOGISTICA[estado]} {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Ruta({ tour }: { tour: Tour }) {
  const paradas = tour.shows;
  const maps = paradas.length
    ? `https://www.google.com/maps/dir/${paradas.map((s) => `${s.lat},${s.lng}`).join('/')}`
    : null;

  return (
    <section aria-label="Ruta" className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Ruta</h2>
        {maps && (
          <a
            href={maps}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-brand-600 hover:underline"
          >
            Abrir en Google Maps ↗
          </a>
        )}
      </div>

      {paradas.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Los shows aún no tienen coordenadas del venue (se toman de Google Places al fijar el
          sitio).
        </p>
      ) : (
        <>
          <EsquemaRuta paradas={paradas} />
          <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {paradas.map((parada, i) => (
              <div key={parada.id} className="flex items-center gap-2 text-xs">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-slate-700">{parada.ciudad}</span>
                <span className="shrink-0 text-slate-400">{formatFechaTour(parada.fecha)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

const ANCHO = 640;
const ALTO = 320;
const MARGEN = 26;

/**
 * Esquema de la ruta: las paradas proyectadas sobre la caja, centradas y con el
 * margen que deja el live para que quepan los círculos.
 *
 * La proyección exacta del live no se pudo deducir de la captura (los tres
 * puntos no bastan para fijarla), así que ésta es nuestra: lineal en longitud y
 * latitud, ajustada a la caja. El resto —colores, radios, rejilla y grosores—
 * sí está calcado.
 */
function EsquemaRuta({ paradas }: { paradas: TourShow[] }) {
  const lngs = paradas.map((p) => p.lng);
  const lats = paradas.map((p) => p.lat);
  const proyecta = (valor: number, min: number, max: number, largo: number) => {
    if (max === min) return largo / 2;
    return MARGEN + ((valor - min) / (max - min)) * (largo - MARGEN * 2);
  };
  const puntos = paradas.map((p) => ({
    x: proyecta(p.lng, Math.min(...lngs), Math.max(...lngs), ANCHO),
    y: ALTO - proyecta(p.lat, Math.min(...lats), Math.max(...lats), ALTO),
  }));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="h-auto w-full"
        role="img"
        aria-label="Esquema de la ruta del tour"
      >
        {[1, 2, 3].map((i) => (
          <g key={i} stroke="#e2e8f0" strokeWidth="1">
            <line x1={(ANCHO / 4) * i} y1="0" x2={(ANCHO / 4) * i} y2={ALTO} />
            <line x1="0" y1={(ALTO / 4) * i} x2={ANCHO} y2={(ALTO / 4) * i} />
          </g>
        ))}
        <polyline
          points={puntos.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {puntos.map((p, i) => (
          <g key={paradas[i].id}>
            <circle cx={p.x} cy={p.y} r="12" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#fff"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function GastosDeTour({ tour, importe }: { tour: Tour; importe: (n: number) => string }) {
  return (
    <section aria-label="Gastos de tour (no cuelgan de un show)" className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Gastos de tour{' '}
          <span className="ml-1 font-normal normal-case text-slate-400">
            (no cuelgan de un show)
          </span>
        </h2>
      </div>
      <p className="text-xl font-bold text-slate-800">
        {importe(tour.gastosArtista + tour.gastosAgencia)}
      </p>
      <button type="button" className="btn-secondary mt-3 text-xs">
        + Gasto de tour
      </button>
    </section>
  );
}

function PnlDetallado({ tour, importe }: { tour: Tour; importe: (n: number) => string }) {
  const pnl = tourPnl(tour);
  return (
    <section aria-label="P&L detallado" className="card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        P&amp;L detallado
      </h2>
      <dl className="space-y-1.5 text-sm">
        <LineaPnl termino="Cachés netos (shows)" valor={importe(pnl.cachesNetos)} />
        <LineaPnl termino="− Gastos de tour (artista)" valor={importe(pnl.gastosArtista)} />
        <LineaPnl termino="Neto del artista" valor={importe(pnl.netoArtista)} total />
      </dl>

      <h3 className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Agencia
      </h3>
      <dl className="space-y-1.5 text-sm">
        <LineaPnl termino="Booking fee (shows)" valor={importe(pnl.bookingFee)} />
        <LineaPnl termino="− Gastos de tour (agencia)" valor={importe(pnl.gastosAgencia)} />
        <LineaPnl termino="Margen agencia" valor={importe(pnl.margenAgencia)} total />
      </dl>
    </section>
  );
}

function LineaPnl({
  termino,
  valor,
  total,
}: {
  termino: string;
  valor: string;
  total?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${total ? 'border-t border-slate-100 pt-1.5 font-semibold text-slate-800' : 'text-slate-500'}`}
    >
      <dt>{termino}</dt>
      <dd className="tabular-nums">{valor}</dd>
    </div>
  );
}
