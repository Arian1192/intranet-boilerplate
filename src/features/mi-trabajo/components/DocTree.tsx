import { useMemo, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { buildTree, filterDocs, SECTIONS } from '../data/docs';
import type { DocNode, DocVisibility } from '../data/seed';
import { DocTreeItem } from './DocTreeItem';

interface Props {
  docs: DocNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: (visibility: DocVisibility, parentId: string | null) => void;
}

export function DocTree({ docs, selectedId, onSelect, onCreate }: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => filterDocs(docs, query), [docs, query]);
  const tree = useMemo(() => buildTree(filtered), [filtered]);

  return (
    <div>
      <div className="mb-3 flex h-9 items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Documentos</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className="h-8 w-32 rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-xs text-slate-600 outline-none focus:border-slate-300"
          />
        </div>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((section) => {
          const node = tree.find((s) => s.key === section.key)!;
          return (
            <div key={section.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{section.title}</span>
                <button
                  type="button"
                  aria-label={`Nuevo en ${section.title}`}
                  onClick={() => onCreate(section.key, null)}
                  className="grid h-5 w-5 place-items-center rounded text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {node.roots.length === 0 ? (
                <p className="px-1 py-0.5 text-xs text-slate-400">Vacío</p>
              ) : (
                node.roots.map((root) => (
                  <DocTreeItem key={root.doc.id} node={root} depth={0} selectedId={selectedId} onSelect={onSelect} onAddChild={(pid) => onCreate(section.key, pid)} />
                ))
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="mt-6 flex items-center gap-1.5 px-1 text-xs text-slate-400 hover:text-slate-600">
        <Trash2 className="h-3.5 w-3.5" /> Papelera
      </button>
    </div>
  );
}
