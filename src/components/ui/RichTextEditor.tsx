import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER = 'Qué necesita la pieza: mensaje, formato, maquetación, referencias…';
const toolBtn = 'grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100';

export interface RichTextEditorProps {
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ placeholder = DEFAULT_PLACEHOLDER, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Placeholder.configure({ placeholder })],
    content: '',
    editorProps: {
      attributes: { class: 'min-h-[90px] px-3 py-2 text-sm leading-snug outline-none' },
    },
  });

  const marks: [string, string, string, () => void][] = [
    ['B', 'Negrita', 'font-bold', () => editor?.chain().focus().toggleBold().run()],
    ['i', 'Cursiva', 'italic', () => editor?.chain().focus().toggleItalic().run()],
    ['U', 'Subrayado', 'underline', () => editor?.chain().focus().toggleUnderline().run()],
    ['S', 'Tachado', 'line-through', () => editor?.chain().focus().toggleStrike().run()],
  ];
  const sizes: [string, string, string][] = [
    ['text-[11px]', 'Texto pequeño', '12px'],
    ['text-sm', 'Texto normal', '15px'],
    ['text-base', 'Texto grande', '20px'],
  ];

  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        {marks.map(([label, title, cls, run]) => (
          <button
            key={title}
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
            className={cn(toolBtn, cls)}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        {sizes.map(([sz, title, px]) => (
          <button
            key={title}
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().setFontSize(px).run()}
            className={toolBtn}
          >
            <span className={sz}>A</span>
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button
          type="button"
          title="Quitar formato"
          aria-label="Quitar formato"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          className={toolBtn}
        >
          <span className="text-xs">✕</span>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
