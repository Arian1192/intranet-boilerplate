import { useState } from 'react';
import { Wand2 } from 'lucide-react';

export function AssistantButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
      >
        <Wand2 className="h-3.5 w-3.5" /> Asistente
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 shadow-lg">
          Selecciona un párrafo para mejorarlo, corregirlo, acortarlo, desarrollarlo o traducirlo. (Demo)
        </div>
      )}
    </div>
  );
}
