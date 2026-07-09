import { useState } from 'react';
import { Badge, Button, Input, Select, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface PieceDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Priority = 'baja' | 'media' | 'alta';
type Ratio = '1:1' | '4:5' | '9:16' | '16:9';
type ApprovalStatus = 'Sin enviar' | 'Pendiente cliente' | 'Aprobado cliente' | 'Cambios cliente';

const PRIORITIES: { label: string; value: Priority }[] = [
  { label: 'Baja', value: 'baja' },
  { label: 'Media', value: 'media' },
  { label: 'Alta', value: 'alta' },
];
const RATIOS: Ratio[] = ['1:1', '4:5', '9:16', '16:9'];
const APPROVAL_OPTIONS: ApprovalStatus[] = [
  'Sin enviar',
  'Pendiente cliente',
  'Aprobado cliente',
  'Cambios cliente',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</p>;
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {children}
    </div>
  );
}

function AssignSlot({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <SectionLabel>{label}</SectionLabel>
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-500"
      >
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-300"
        >
          +
        </span>
        Asignar
      </button>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
  shape = 'pill',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  shape?: 'pill' | 'rounded';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border px-3 py-1.5 text-sm font-medium transition-colors',
        shape === 'pill' ? 'rounded-full' : 'rounded-lg px-4 py-2',
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      )}
    >
      {children}
    </button>
  );
}

const TOOLBAR_TEXT_BUTTONS = ['B', 'i', 'U', 'S'] as const;

function BriefToolbar() {
  return (
    <div className="flex items-center gap-3 rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2">
        {TOOLBAR_TEXT_BUTTONS.map((label) => (
          <button
            key={label}
            type="button"
            className={cn(
              'flex h-6 w-6 items-center justify-center text-sm font-semibold text-slate-500 hover:text-slate-700',
              label === 'B' && 'font-bold',
              label === 'i' && 'italic',
              label === 'U' && 'underline',
              label === 'S' && 'line-through'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <span className="h-4 w-px bg-slate-200" aria-hidden />
      <div className="flex items-center gap-2">
        <button type="button" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
          A
        </button>
        <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-700">
          A
        </button>
        <button type="button" className="text-base font-semibold text-slate-500 hover:text-slate-700">
          A
        </button>
      </div>
      <span className="h-4 w-px bg-slate-200" aria-hidden />
      <button type="button" className="text-sm text-slate-500 hover:text-slate-700" aria-label="Limpiar formato">
        ✕
      </button>
    </div>
  );
}

export function PieceDrawer({ open, onClose }: PieceDrawerProps) {
  const [priority, setPriority] = useState<Priority>('media');
  const [ratios, setRatios] = useState<Set<Ratio>>(new Set(['9:16']));
  const [approval, setApproval] = useState<ApprovalStatus>('Sin enviar');

  if (!open) return null;

  const toggleRatio = (ratio: Ratio) => {
    setRatios((current) => {
      const next = new Set(current);
      if (next.has(ratio)) {
        next.delete(ratio);
      } else {
        next.add(ratio);
      }
      return next;
    });
  };

  return (
    <div role="presentation" onClick={onClose} className="fixed inset-0 z-50 bg-slate-900/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nueva pieza"
        onClick={(event) => event.stopPropagation()}
        className="fixed right-0 top-0 flex h-full w-full max-w-[640px] flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Nueva pieza</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="text-xl text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <Input label="Nombre *" placeholder="Ej: Reel lanzamiento v2" />

          <div className="grid grid-cols-2 gap-6 rounded-xl bg-slate-50 p-4">
            <AssignSlot label="Responsable" />
            <AssignSlot label="Aprueba" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Select label="Tipo" defaultValue="estatico">
              <option value="estatico">Estático</option>
              <option value="video">Vídeo</option>
              <option value="animado">Animado</option>
            </Select>
            <Select label="Departamento" defaultValue="diseno">
              <option value="diseno">Diseño</option>
              <option value="video">Vídeo</option>
              <option value="social">Social</option>
            </Select>
            <Select label="Estado" defaultValue="briefing">
              <option value="briefing">Briefing</option>
              <option value="en-produccion">En producción</option>
              <option value="revision">Revisión</option>
              <option value="cambios">Cambios</option>
              <option value="aprobado">Aprobado</option>
            </Select>
            <Input label="Versión" defaultValue="1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Prioridad">
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((option) => (
                  <ToggleChip
                    key={option.value}
                    active={priority === option.value}
                    onClick={() => setPriority(option.value)}
                  >
                    {option.label}
                  </ToggleChip>
                ))}
              </div>
            </FieldGroup>
            <Input label="Deadline" placeholder="dd/mm/aaaa" />
          </div>

          <FieldGroup label="Tamaños / ratios">
            <div className="flex flex-wrap gap-2">
              {RATIOS.map((ratio) => (
                <ToggleChip key={ratio} shape="rounded" active={ratios.has(ratio)} onClick={() => toggleRatio(ratio)}>
                  {ratio}
                </ToggleChip>
              ))}
            </div>
          </FieldGroup>

          <div className="space-y-2 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4">
            <SectionLabel>Adaptaciones / versiones</SectionLabel>
            <p className="text-sm text-slate-500">
              Genera de golpe la principal + otras versiones de la misma pieza (estático/vídeo/animado, «Sold
              Out 1st Release», etc.). Comparten evento, cuenta y brief; cada una es su propia pieza con su
              estado y aprobación.
            </p>
            <button type="button" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              + Añadir adaptación
            </button>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-100 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              ¿Para quién? <span className="text-xs font-normal normal-case text-slate-400">· elige solo uno</span>
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Select label="Cuenta Euphoric" defaultValue="">
                <option value="">—</option>
              </Select>
              <Input label="Cliente (CRM)" placeholder="Cliente..." />
              <Select label="Empresa interna" defaultValue="">
                <option value="">—</option>
              </Select>
            </div>
          </div>

          <Input label="Evento" placeholder="Buscar o crear evento…" />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Campaña" defaultValue="">
              <option value="">Sin campaña</option>
            </Select>
            <Select label="Publicación" defaultValue="">
              <option value="">Sin publicación</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-700">Brief</p>
            <BriefToolbar />
            <Textarea
              className="rounded-t-none"
              placeholder="Qué necesita la pieza: mensaje, formato, maquetación, referencias…"
            />
          </div>

          <Input label="Enlace al asset" placeholder="Drive / Frame.io / Dropbox…" />

          <FieldGroup label="Adjuntos">
            <button
              type="button"
              className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              + Adjuntar
            </button>
          </FieldGroup>

          <div className="space-y-3 rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Aprobación del cliente</SectionLabel>
              <Badge variant="neutral">{approval}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {APPROVAL_OPTIONS.map((option) => (
                <ToggleChip key={option} active={approval === option} onClick={() => setApproval(option)}>
                  {option}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-100 p-4">
            <SectionLabel>Checklist</SectionLabel>
            <button type="button" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              + Añadir tarea
            </button>
          </div>

          <Textarea label="Notas" />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onClose}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}
