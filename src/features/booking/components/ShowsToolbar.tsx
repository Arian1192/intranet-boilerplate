export interface ShowsToolbarProps {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  rangoLabel: string;
  onToggleRango: () => void;
  onOpenFiltros: () => void;
  /** `Solo futuros` está pulsado: el live lo pinta en `brand-600` relleno. */
  soloFuturos: boolean;
  onToggleSoloFuturos: () => void;
}

/** El botón de la toolbar: mismo molde para `Solo futuros`, el rango y Filtros. */
const BOTON = 'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors';
const APAGADO = 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50';
/** Encendido, medido en el live. `brand-*` tal cual: el violeta lo pone `apx.css`. */
const ENCENDIDO = 'border-brand-600 bg-brand-600 text-white';

/**
 * Toolbar de `/shows` — recalco del live del 2026-09-09.
 *
 * Tres cosas que no teníamos y estaban medidas: el botón **`Solo futuros`**, los
 * iconos en SVG donde nosotros poníamos emoji (`🗓`, `⛃`, `▾`), y la lupa dentro
 * del buscador. Los botones son de `h-9`, no de `h-10`.
 *
 * El contador cuenta **lo filtrado**: medido en el live pulsando `Solo futuros`,
 * donde «87 shows» pasa a «70 shows». Ya lo hacíamos así.
 */
export function ShowsToolbar({
  count,
  query,
  onQueryChange,
  rangoLabel,
  onToggleRango,
  onOpenFiltros,
  soloFuturos,
  onToggleSoloFuturos,
}: ShowsToolbarProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Shows</h1>
        <p className="text-sm text-slate-500">
          {count} {count === 1 ? 'show' : 'shows'}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            autoComplete="off"
            name="buscar-shows"
            className="input h-9 w-full pl-9"
            placeholder="Buscar artista, evento, venue…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>

        <button
          type="button"
          title="Ocultar los shows ya pasados"
          onClick={onToggleSoloFuturos}
          className={`${BOTON} shrink-0 ${soloFuturos ? ENCENDIDO : APAGADO}`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          Solo futuros
        </button>

        <div className="relative">
          <button type="button" onClick={onToggleRango} className={`${BOTON} ${APAGADO}`}>
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4.5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v3M16 3v3" />
            </svg>
            <span className="truncate">{rangoLabel}</span>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button type="button" onClick={onOpenFiltros} className={`${BOTON} ${APAGADO}`}>
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h18l-7 8v6l-4-2v-4z" />
            </svg>
            <span>Filtros</span>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
