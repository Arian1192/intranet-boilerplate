import { useEffect } from 'react';
import { MoreHorizontal, Maximize2 } from 'lucide-react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { DocNode, DocVisibility } from '../data/seed';
import { docBlockNoteTheme } from '../editor/blocknote-theme';
import { AssistantButton } from './AssistantButton';

const VIS: { value: DocVisibility; label: string }[] = [
  { value: 'privado', label: 'Privado' },
  { value: 'compartido', label: 'Compartido' },
  { value: 'equipo', label: 'Todo el equipo' },
];

interface Props {
  doc: DocNode;
  onTitleChange: (id: string, title: string) => void;
  onVisibilityChange: (id: string, v: DocVisibility) => void;
}

export function DocEditor({ doc, onTitleChange, onVisibilityChange }: Props) {
  // Recrea el editor por doc (key en el padre garantiza remount al cambiar de doc).
  const editor = useCreateBlockNote({ initialContent: doc.content });

  // Enfoca al montar sin robar el foco de inputs de la toolbar.
  useEffect(() => { /* noop: el foco lo gestiona el usuario */ }, [doc.id]);

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-3 flex h-9 shrink-0 items-center gap-1">
        <button type="button" className="grid h-8 w-7 place-items-center rounded-lg text-base leading-none hover:bg-slate-100">{doc.emoji}</button>
        <input
          aria-label="Título del documento"
          value={doc.title}
          onChange={(e) => onTitleChange(doc.id, e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 outline-none"
        />
        <span className="shrink-0 text-xs text-slate-400">{doc.updatedLabel}</span>
        <AssistantButton />
        <select
          aria-label="Visibilidad"
          value={doc.visibility}
          onChange={(e) => onVisibilityChange(doc.id, e.target.value as DocVisibility)}
          className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600"
        >
          {VIS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
        <button type="button" aria-label="Más opciones" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
        <button type="button" aria-label="Pantalla completa" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><Maximize2 className="h-4 w-4" /></button>
      </div>

      <article className="min-h-[70vh] rounded-2xl border border-slate-200/70 bg-white pb-16 pt-6">
        <BlockNoteView editor={editor} theme={docBlockNoteTheme} className="doc-canvas" />
      </article>
    </div>
  );
}
