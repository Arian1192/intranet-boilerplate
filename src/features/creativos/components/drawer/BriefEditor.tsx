import { cn } from '@/lib/utils';

const MARKS: [string, string, string][] = [
  ['B', 'Negrita', 'font-bold'],
  ['i', 'Cursiva', 'italic'],
  ['U', 'Subrayado', 'underline'],
  ['S', 'Tachado', 'line-through'],
];

const SIZES: [string, string][] = [
  ['text-[11px]', 'Texto pequeño'],
  ['text-sm', 'Texto normal'],
  ['text-base', 'Texto grande'],
];

const toolBtn = 'grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100';

export function BriefEditor() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        {MARKS.map(([label, title, cls]) => (
          <button key={title} type="button" title={title} aria-label={title} className={cn(toolBtn, cls)}>
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        {SIZES.map(([sz, title]) => (
          <button key={title} type="button" title={title} aria-label={title} className={toolBtn}>
            <span className={sz}>A</span>
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Quitar formato" aria-label="Quitar formato" className={toolBtn}>
          <span className="text-xs">✕</span>
        </button>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Qué necesita la pieza: mensaje, formato, maquetación, referencias…"
        className="min-h-[90px] px-3 py-2 text-sm leading-snug outline-none [&:empty]:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
