import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Badge, Button, RichTextEditor } from '@/components/ui';
import { SegmentedButtons } from './drawer/SegmentedButtons';

export interface NuevaPiezaDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NuevaPiezaDrawer({ open, onClose }: NuevaPiezaDrawerProps) {
  const [priority, setPriority] = useState('Media');
  const [ratios, setRatios] = useState<string[]>([]);
  const [approval, setApproval] = useState('Sin enviar');

  if (!open) return null;

  const toggleRatio = (r: string) =>
    setRatios((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={onClose} aria-hidden="true" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:inset-y-4 sm:right-4 sm:w-[32rem] sm:overflow-hidden sm:rounded-2xl sm:border lg:w-[32rem]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-lg font-semibold text-slate-800">Nueva pieza</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nombre */}
            <div className="sm:col-span-2">
              <label className="label">Nombre *</label>
              <input className="input" placeholder="Ej: Reel lanzamiento v2" />
            </div>

            {/* Responsable / Aprueba */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
              {['Responsable', 'Aprueba'].map((role) => (
                <div key={role}>
                  <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {role}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-200"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">
                      ＋
                    </span>
                    <span>Asignar</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Tipo / Departamento (celda 1-col con grid interno) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Tipo</label>
                <select className="select">
                  <option>Estático</option>
                  <option>Animado</option>
                  <option>Vídeo</option>
                </select>
              </div>
              <div>
                <label className="label">Departamento</label>
                <select className="select">
                  <option>Diseño</option>
                  <option>Vídeo</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>

            {/* Estado / Versión */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Estado</label>
                <select className="select">
                  <option>Briefing</option>
                  <option>En producción</option>
                  <option>Revisión</option>
                  <option>Cambios</option>
                  <option>Aprobado</option>
                </select>
              </div>
              <div>
                <label className="label">Versión</label>
                <input type="number" min={1} defaultValue={1} className="input" />
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="label">Prioridad</label>
              <SegmentedButtons
                options={['Baja', 'Media', 'Alta']}
                value={priority}
                onChange={setPriority}
                className="flex gap-1.5"
                buttonClassName="flex-1 px-2 py-1.5 text-xs"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="label">Deadline</label>
              <div className="input relative flex items-center gap-2">
                <span className="truncate text-slate-400">dd/mm/aaaa</span>
                <Calendar className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="date"
                  aria-label="Fecha"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>

            {/* Tamaños / ratios */}
            <div className="sm:col-span-2">
              <label className="label">Tamaños / ratios</label>
              <SegmentedButtons
                options={['1:1', '4:5', '9:16', '16:9']}
                value={ratios}
                onChange={toggleRatio}
                className="flex flex-wrap gap-2"
                buttonClassName="px-3 py-1.5 text-sm hover:bg-slate-50"
              />
            </div>

            {/* Adaptaciones / versiones */}
            <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50/40 p-3 sm:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Adaptaciones / versiones
                </span>
              </div>
              <p className="mb-2 text-[11px] text-slate-500">
                Genera de golpe la principal + otras versiones de la misma pieza (estático/vídeo/animado,
                «Sold Out 1st Release», etc.). Comparten evento, cuenta y brief; cada una es su propia pieza
                con su estado y aprobación.
              </p>
              <button type="button" className="text-xs font-medium text-brand-600 hover:underline">
                ＋ Añadir adaptación
              </button>
            </div>

            {/* ¿Para quién? */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                ¿Para quién? <span className="font-normal normal-case text-slate-400">· elige solo uno</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Cuenta Euphoric</label>
                  <select className="select">
                    <option>—</option>
                    <option>SIGHT</option>
                  </select>
                </div>
                <div>
                  <label className="label">Cliente (CRM)</label>
                  <input className="input" placeholder="Cliente…" />
                </div>
                <div>
                  <label className="label">Empresa interna</label>
                  <select className="select">
                    <option>—</option>
                    <option>ConceptOne</option>
                    <option>CRUDA</option>
                    <option>Etra Agency</option>
                    <option>Euphoric Media</option>
                    <option>Mixmag Spain</option>
                    <option>TAGMAG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Evento */}
            <div className="sm:col-span-2">
              <label className="label">Evento</label>
              <input className="input" placeholder="Buscar o crear evento…" />
            </div>

            {/* Campaña */}
            <div>
              <label className="label">Campaña</label>
              <select className="select">
                <option>Sin campaña</option>
                <option>Genérico Julio</option>
              </select>
            </div>

            {/* Publicación */}
            <div>
              <label className="label">Publicación</label>
              <select className="select">
                <option>Sin publicación</option>
                <option>Set Times · 2026-07-10</option>
              </select>
            </div>

            {/* Brief */}
            <div className="sm:col-span-2">
              <label className="label">Brief</label>
              <RichTextEditor />
            </div>

            {/* Enlace al asset */}
            <div className="sm:col-span-2">
              <label className="label">Enlace al asset</label>
              <input className="input" placeholder="Drive / Frame.io / Dropbox…" />
            </div>

            {/* Adjuntos */}
            <div className="sm:col-span-2">
              <label className="label">Adjuntos</label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-xs text-slate-500 hover:border-brand-400 hover:text-brand-600">
                  ＋ Adjuntar
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Aprobación del cliente */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Aprobación del cliente
                </span>
                <Badge variant="neutral">{approval}</Badge>
              </div>
              <SegmentedButtons
                options={['Sin enviar', 'Pendiente cliente', 'Aprobado cliente', 'Cambios cliente']}
                value={approval}
                onChange={setApproval}
                className="flex flex-wrap gap-1.5"
                buttonClassName="px-2.5 py-1 text-xs"
              />
            </div>

            {/* Checklist */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist</span>
              </div>
              <button type="button" className="text-xs text-brand-600 hover:underline">
                ＋ Añadir tarea
              </button>
            </div>

            {/* Notas */}
            <div className="sm:col-span-2">
              <label className="label">Notas</label>
              <textarea className="input min-h-[60px]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
          <span />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={onClose}>
              Guardar
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
