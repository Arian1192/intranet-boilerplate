import type { ContentTeam } from '../data/contenidos';

export interface TeamTabsProps {
  counts: { todos: number; redes: number; web: number; revista: number };
  active: ContentTeam | 'todos';
  onSelect: (t: ContentTeam | 'todos') => void;
}

const TABS: { id: ContentTeam | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'redes', label: 'Redes' },
  { id: 'web', label: 'Web' },
  { id: 'revista', label: 'Revista' },
];

export function TeamTabs({ counts, active, onSelect }: TeamTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(t.id)}
            className={`rounded-md px-3 py-1 text-sm ${on ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {t.label} <span className="ml-1 text-xs opacity-60">{counts[t.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
