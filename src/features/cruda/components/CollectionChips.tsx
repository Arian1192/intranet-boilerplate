import { useState } from 'react';
import { cn } from '@/lib/utils';

export function CollectionChips({ collections, onSelect }: { collections: string[]; onSelect?: (c: string) => void }) {
  const [active, setActive] = useState('Todas');
  const pick = (c: string) => { setActive(c); onSelect?.(c); };
  const chip = (c: string, count?: number) => (
    <button key={c} type="button" onClick={() => pick(c)}
      className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        active === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
      {c}{count !== undefined && <span className="opacity-70">{count}</span>}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chip('Todas', collections.length)}
      {collections.map((c) => (
        <span key={c} className="inline-flex items-center gap-1">
          {chip(c, 1)}
          <button type="button" aria-label={`Editar ${c}`} className="text-slate-400 hover:text-slate-600">✎</button>
        </span>
      ))}
      {chip('Sin colección')}
    </div>
  );
}
