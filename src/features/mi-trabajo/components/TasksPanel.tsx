import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { DocNode, DocTask } from '../data/seed';

const TABS = ['Mías', 'Creadas', 'Todas', 'Ver hechas'] as const;

interface Props {
  doc: DocNode | null;
  tasks: DocTask[];
}

export function TasksPanel({ doc, tasks }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Mías');
  const docTasks = doc ? tasks.filter((t) => t.docId === doc.id && !t.done) : [];

  return (
    <div>
      <div className="mb-3 flex h-9 items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">Tareas</h2>
        <button
          type="button"
          aria-label="Añadir tarea"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Card className="mb-3 border-brand-200/70 bg-brand-50/30 p-3 shadow-none">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            DE ESTE DOCUMENTO
          </span>
          <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
            + Tarea
          </button>
        </div>
        <p className="text-xs text-slate-400">
          {docTasks.length === 0
            ? 'Ninguna. Lo que salga de aquí y haya que hacer, cuélgalo como tarea.'
            : `${docTasks.length} pendiente(s).`}
        </p>
      </Card>

      <Card className="p-3 shadow-none">
        <input
          placeholder="Tarea de este documento…"
          className="input mb-2 h-8 py-0 text-sm"
        />
        <div className="mb-2 flex items-center justify-between gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded px-1.5 py-0.5 text-xs',
                tab === t ? 'font-semibold text-slate-800' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {docTasks.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">Nada pendiente. 🎉</p>
        ) : (
          <ul className="space-y-1">
            {docTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" defaultChecked={t.done} className="accent-brand-600" />
                <span className="truncate">{t.text}</span>
                {t.dueLabel && <span className="ml-auto shrink-0 text-xs text-slate-400">{t.dueLabel}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
