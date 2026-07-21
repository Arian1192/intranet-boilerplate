import { useState } from 'react';

export interface ReportDialogProps {
  onCancel: () => void;
  onSend: () => void;
}

const PLACEHOLDERS = {
  bug: 'Qué esperabas que pasara y qué ha pasado…',
  idea: 'Qué se podría hacer mejor…',
} as const;

export function ReportDialog({ onCancel, onSend }: ReportDialogProps) {
  const [tab, setTab] = useState<'bug' | 'idea'>('bug');
  const [text, setText] = useState('');
  const canSend = text.trim() !== '';

  const tabClass = (active: boolean) =>
    `rounded-md px-2 py-0.5 text-xs font-medium ${
      active ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="fixed inset-0 z-40 cursor-default bg-slate-900/40"
      />
      <div className="fixed bottom-4 left-4 z-50 w-[480px] rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Reportar</h2>
          <div className="inline-flex items-center">
            <button type="button" onClick={() => setTab('bug')} className={tabClass(tab === 'bug')}>
              Algo falla
            </button>
            <button type="button" onClick={() => setTab('idea')} className={tabClass(tab === 'idea')}>
              Una idea
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDERS[tab]}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="button"
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-center text-sm"
        >
          <span className="font-medium text-slate-600">Añadir captura</span>
          <span className="text-slate-400"> · o pega una con ⌘V</span>
        </button>

        <p className="mt-3 text-[11px] text-slate-400">
          Se adjuntan solos la página, el navegador, el tamaño de ventana y los últimos errores.
        </p>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={() => canSend && onSend()}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              canSend
                ? 'bg-slate-800 text-white hover:bg-slate-900'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
