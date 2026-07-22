import { SegmentedControl } from '@/components/ui';

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
      <SegmentedControl options={SCOPES.map((s) => ({ label: s.label, value: s.id }))} value={scope} onChange={onScope} />
      <div className="ml-auto flex items-center gap-3">
        <SegmentedControl
          options={[
            { label: 'Panel', value: 'panel' },
            { label: 'Kanban', value: 'kanban' },
          ]}
          value={view}
          onChange={onView}
        />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Contenido
        </button>
      </div>
    </div>
  );
}
