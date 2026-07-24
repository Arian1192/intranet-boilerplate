import { Avatar, Button } from '@/components/ui';
import type { Responsable } from '../data/types';

interface Props {
  responsables: Responsable[];
  onRemove: (id: string) => void;
  onAnadir?: () => void;
}

export function ResponsablesChips({ responsables, onRemove, onAnadir }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {responsables.map((r) => (
        <span
          key={r.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 py-1 pl-1 pr-2 text-sm text-slate-700"
        >
          <Avatar fallback={r.iniciales} size="sm" />
          {r.nombre}
          <button
            type="button"
            aria-label={`Quitar ${r.nombre}`}
            onClick={() => onRemove(r.id)}
            className="text-slate-400 hover:text-red-500"
          >
            ✕
          </button>
        </span>
      ))}
      <Button variant="ghost" size="sm" onClick={onAnadir}>＋ Añadir</Button>
    </div>
  );
}
