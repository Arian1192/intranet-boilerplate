import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui';

interface Props {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, summary, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>{open ? '▾' : '▸'}</span>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </span>
        {!open && summary && <span className="text-xs text-slate-400">{summary}</span>}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  );
}
