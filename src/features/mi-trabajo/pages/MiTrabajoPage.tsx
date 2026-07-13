import { useMemo, useState } from 'react';
import { DocTree } from '../components/DocTree';
import { DocEditor } from '../components/DocEditor';
import { TasksPanel } from '../components/TasksPanel';
import { docs as seedDocs, tasks as seedTasks, WELCOME_ID } from '../data/seed';
import { createDoc, findDoc } from '../data/docs';
import type { DocNode, DocVisibility } from '../data/seed';

export function MiTrabajoPage() {
  const [docs, setDocs] = useState<DocNode[]>(seedDocs);
  const [selectedId, setSelectedId] = useState<string>(WELCOME_ID);
  const selected = useMemo(() => findDoc(docs, selectedId) ?? null, [docs, selectedId]);

  const handleCreate = (visibility: DocVisibility, parentId: string | null) => {
    const doc = createDoc(visibility, parentId);
    setDocs((prev) => [...prev, doc]);
    setSelectedId(doc.id);
  };
  const handleTitle = (id: string, title: string) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, title } : d)));
  const handleVisibility = (id: string, v: DocVisibility) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, visibility: v } : d)));

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-56 lg:self-start">
        <DocTree docs={docs} selectedId={selectedId} onSelect={setSelectedId} onCreate={handleCreate} />
      </aside>

      <main className="min-w-0 flex-1">
        {selected ? (
          <DocEditor key={selected.id} doc={selected} onTitleChange={handleTitle} onVisibilityChange={handleVisibility} />
        ) : (
          <div className="grid min-h-[70vh] place-items-center rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400">
            Documentos a la izquierda, tareas a la derecha. Abre uno o empieza a escribir.
          </div>
        )}
      </main>

      <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-72 lg:self-start">
        <TasksPanel doc={selected} tasks={seedTasks} />
      </aside>
    </div>
  );
}
