import { formatCurrency } from '@/lib/format';
import { SegmentedControl } from '@/components/ui';

type View = 'embudo' | 'kanban';

export interface CampanasToolbarProps {
  query: string;
  onQuery: (v: string) => void;
  enElAire: number;
  ganado: number;
  view: View;
  onView: (v: View) => void;
}

export function CampanasToolbar({ query, onQuery, enElAire, ganado, view, onView }: CampanasToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar campaña o anuncian…"
        className="h-9 w-56 rounded-lg border border-slate-200 px-3 text-sm"
      />
      <span className="text-sm text-slate-500">
        En el aire <span className="font-bold text-slate-800">{formatCurrency(enElAire)}</span>
      </span>
      <span className="text-sm text-slate-500">
        Ganado <span className="font-bold text-slate-800">{formatCurrency(ganado)}</span>
      </span>
      <div className="ml-auto flex items-center gap-3">
        <SegmentedControl
          options={[
            { label: 'Embudo', value: 'embudo' },
            { label: 'Kanban', value: 'kanban' },
          ]}
          value={view}
          onChange={onView}
        />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Campaña
        </button>
      </div>
    </div>
  );
}
