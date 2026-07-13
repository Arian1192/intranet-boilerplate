import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TreeNode } from '../data/docs';

interface Props {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export function DocTreeItem({ node, depth, selectedId, onSelect, onAddChild }: Props) {
  const { doc, children } = node;
  const selected = selectedId === doc.id;
  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-lg pr-1 text-sm text-slate-700 hover:bg-slate-50',
          selected && 'bg-slate-100 font-medium text-slate-900'
        )}
        style={{ paddingLeft: 4 + depth * 14 }}
      >
        <button
          type="button"
          onClick={() => onSelect(doc.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1 text-left"
        >
          <span className="text-base leading-none">{doc.emoji}</span>
          <span className="truncate">{doc.title}</span>
        </button>
        <button
          type="button"
          aria-label={`Nuevo dentro de ${doc.title}`}
          onClick={() => onAddChild(doc.id)}
          className="grid h-6 w-6 shrink-0 place-items-center rounded text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-500"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {children.map((child) => (
        <DocTreeItem key={child.doc.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} onAddChild={onAddChild} />
      ))}
    </div>
  );
}
