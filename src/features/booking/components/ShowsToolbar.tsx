import { Input } from '@/components/ui';

export interface ShowsToolbarProps {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  rangoLabel: string;
  onToggleRango: () => void;
  onOpenFiltros: () => void;
}

export function ShowsToolbar({
  count,
  query,
  onQueryChange,
  rangoLabel,
  onToggleRango,
  onOpenFiltros,
}: ShowsToolbarProps) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold text-slate-900">Shows</h1>
      <p className="mt-1 text-sm text-slate-400">
        {count} {count === 1 ? 'show' : 'shows'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[240px] flex-1">
          <Input
            type="search"
            name="buscar-shows"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar artista, evento, venue…"
          />
        </div>
        <button
          type="button"
          onClick={onToggleRango}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span aria-hidden>🗓</span>
          {rangoLabel}
          <span aria-hidden className="text-slate-400">▾</span>
        </button>
        <button
          type="button"
          onClick={onOpenFiltros}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span aria-hidden>⛃</span>
          Filtros
          <span aria-hidden className="text-slate-400">▾</span>
        </button>
      </div>
    </div>
  );
}
