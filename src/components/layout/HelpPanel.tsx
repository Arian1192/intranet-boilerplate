import { useEffect, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { ReportDialog } from './ReportDialog';

export function HelpPanel() {
  const [open, setOpen] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), 3000);
    return () => clearTimeout(timer);
  }, [sent]);

  if (reporting) {
    return (
      <ReportDialog
        onCancel={() => setReporting(false)}
        onSend={() => {
          setReporting(false);
          setSent(true);
        }}
      />
    );
  }

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 left-4 z-30 w-[352px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <HelpCircle className="h-4 w-4 text-slate-500" />
              Ayuda
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Cerrar ayuda"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Pregunta o cuenta qué falla…"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              Enviar
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="hover:text-slate-600"
            >
              Reportar con captura
            </button>
            <button type="button" className="hover:text-slate-600">
              Mis avisos
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:text-slate-800"
          aria-label="Abrir ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      )}
      {sent && (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg">
          Gracias, hemos recibido tu incidencia.
        </div>
      )}
    </>
  );
}
