import { useState } from 'react';
import { RichTextEditor } from '@/components/ui';

/** Prioridades del selector del live, en su orden. */
export const PRIORIDADES = ['Alta', 'Media', 'Baja'] as const;
export type Prioridad = (typeof PRIORIDADES)[number];

/** Opciones de «Vincular a», en el orden del live. */
export const VINCULOS = ['Ninguno', 'Show', 'Cuenta', 'Evento', 'Documento'] as const;
export type Vinculo = (typeof VINCULOS)[number];

export interface NuevaTarea {
  titulo: string;
  prioridad: Prioridad;
  fechaLimite: string;
  asignados: string[];
  vinculo: Vinculo;
  nota: string;
}

export interface NuevaTareaDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (tarea: NuevaTarea) => void;
  /** Nombre que aparece pre-asignado en «Asignar a», como el `test` del live. */
  usuario: string;
}

export function NuevaTareaDrawer({ open, onClose, onSave, usuario }: NuevaTareaDrawerProps) {
  const [titulo, setTitulo] = useState('');
  const [prioridad, setPrioridad] = useState<Prioridad>('Media');
  const [fechaLimite, setFechaLimite] = useState('');
  const [asignados, setAsignados] = useState<string[]>([usuario]);
  const [vinculo, setVinculo] = useState<Vinculo>('Ninguno');
  const [nota, setNota] = useState('');

  if (!open) return null;

  const guardar = () => {
    if (!titulo.trim()) return;
    onSave({ titulo: titulo.trim(), prioridad, fechaLimite, asignados, vinculo, nota });
    setTitulo('');
    setPrioridad('Media');
    setFechaLimite('');
    setAsignados([usuario]);
    setVinculo('Ninguno');
    setNota('');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-label="Nueva tarea"
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[32rem]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-lg font-semibold text-slate-800">Nueva tarea</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label className="label" htmlFor="tarea-titulo">
              Título *
            </label>
            <input
              id="tarea-titulo"
              className="input"
              placeholder="¿Qué hay que hacer?"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tarea-prioridad">
                Prioridad
              </label>
              <select
                id="tarea-prioridad"
                className="select"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as Prioridad)}
              >
                {PRIORIDADES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="tarea-fecha">
                Fecha límite
              </label>
              <input
                id="tarea-fecha"
                type="date"
                className="input"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span className="label">Asignar a</span>
            <div className="flex flex-wrap items-center gap-2">
              {asignados.map((nombre) => (
                <span
                  key={nombre}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-1 pr-2 text-sm text-slate-700"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-[11px] font-semibold uppercase text-white">
                    {nombre.charAt(0)}
                  </span>
                  {nombre}
                  <button
                    type="button"
                    aria-label={`Quitar a ${nombre}`}
                    onClick={() => setAsignados((prev) => prev.filter((n) => n !== nombre))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setAsignados((prev) => (prev.includes(usuario) ? prev : [...prev, usuario]))}
                className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-100"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-slate-300">
                  ＋
                </span>
                Añadir
              </button>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="tarea-vinculo">
              Vincular a <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <select
              id="tarea-vinculo"
              className="select w-32"
              value={vinculo}
              onChange={(e) => setVinculo(e.target.value as Vinculo)}
            >
              {VINCULOS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="label">Nota</span>
            <RichTextEditor placeholder="Escribe aquí… (listas, casillas, enlaces)" onChange={setNota} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ✕ Cerrar
          </button>
          <button
            type="button"
            onClick={guardar}
            className="rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-[#35353c]"
          >
            Guardar
          </button>
        </div>
      </aside>
    </>
  );
}
