type Scope = 'todo' | 'campana' | 'organico';
type View = 'panel' | 'kanban';

export interface ContenidosToolbarProps {
  spaceName: string;
  accent: string;
  query: string;
  onQuery: (v: string) => void;
  mine: boolean;
  onMine: (v: boolean) => void;
  scope: Scope;
  onScope: (v: Scope) => void;
  view: View;
  onView: (v: View) => void;
}

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'campana', label: 'De campaña' },
  { id: 'organico', label: 'Orgánico' },
];

function Segment<T extends string>({ items, active, onSelect }: { items: { id: T; label: string }[]; active: T; onSelect: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-pressed={active === it.id}
          onClick={() => onSelect(it.id)}
          className={`rounded-md px-3 py-1 text-sm ${active === it.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function ContenidosToolbar({ spaceName, accent, query, onQuery, mine, onMine, scope, onScope, view, onView }: ContenidosToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800">{spaceName}</span>
      </div>
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar por título o texto…"
        className="h-9 w-64 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <button
        type="button"
        aria-pressed={mine}
        onClick={() => onMine(!mine)}
        className={`text-sm ${mine ? 'font-semibold text-slate-800' : 'text-slate-500'}`}
      >
        Solo lo mío
      </button>
      <Segment items={SCOPES} active={scope} onSelect={onScope} />
      <div className="ml-auto flex items-center gap-3">
        <Segment items={[{ id: 'panel', label: 'Panel' }, { id: 'kanban', label: 'Kanban' }]} active={view} onSelect={onView} />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Contenido
        </button>
      </div>
    </div>
  );
}
