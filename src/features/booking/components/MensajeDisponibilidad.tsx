import { useState } from 'react';

export interface MensajeDisponibilidadProps {
  libres: number;
  mensaje: string;
}

export function MensajeDisponibilidad({ libres, mensaje }: MensajeDisponibilidadProps) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    try {
      // Copiar SÍ funciona (spec D1). Feedback breve; sin depender del resultado en tests.
      void navigator.clipboard?.writeText(mensaje);
      setCopiado(true);
    } catch {
      // entorno sin clipboard: no romper
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500">
          MENSAJE · {libres} LIBRES
        </h2>
        <button
          type="button"
          onClick={copiar}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Copiar
        </button>
      </div>
      <textarea
        readOnly
        value={mensaje}
        rows={9}
        aria-label="Mensaje de disponibilidad"
        className="w-full resize-none rounded-lg border border-slate-200 p-3 font-mono text-sm text-slate-700"
      />
      <span aria-live="polite" className="sr-only">
        {copiado ? 'Copiado' : ''}
      </span>
    </div>
  );
}
