import { useState } from 'react';
import { Card, Input, Select, Textarea, Button, SegmentedControl } from '@/components/ui';

export interface NewsFormProps {
  onClose: () => void;
}

type Timing = 'now' | 'schedule' | 'draft';

const timingOptions: { label: string; value: Timing }[] = [
  { label: 'Ahora', value: 'now' },
  { label: 'Programar', value: 'schedule' },
  { label: 'Borrador', value: 'draft' },
];

const publishLabel: Record<Timing, string> = {
  now: 'Publicar',
  schedule: 'Programar',
  draft: 'Guardar borrador',
};

export function NewsForm({ onClose }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('Todo el grupo');
  const [buttonHref, setButtonHref] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [timing, setTiming] = useState<Timing>('now');
  const [scheduleAt, setScheduleAt] = useState('');
  const [notify, setNotify] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <Card className="border-slate-200 p-5">
      <div className="space-y-4">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-slate-300"
        />
        <Textarea
          label="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-slate-300"
        />
        <Select
          label="Ámbito"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="border-slate-300"
        >
          <option>Todo el grupo</option>
          <option>ConceptOne</option>
          <option>Etra</option>
          <option>Producción</option>
        </Select>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Enlace del botón (opcional)"
            placeholder="https://..."
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            className="border-slate-300"
          />
          <Input
            label="Texto del botón"
            placeholder="Ej.: Confirmar asistencia"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            className="border-slate-300"
          />
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">¿Cuándo se publica?</p>
          <SegmentedControl
            fullWidth
            options={timingOptions}
            value={timing}
            onChange={setTiming}
          />

          {timing === 'schedule' && (
            <div className="mt-4">
              <Input
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="border-slate-300"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Hora de Barcelona. Se publicará y avisará sola en ese momento.
              </p>
            </div>
          )}

          {timing === 'draft' && (
            <p className="mt-4 text-xs text-slate-400">
              Se guarda sin publicar. No avisa a nadie hasta que lo publiques.
            </p>
          )}

          {timing !== 'draft' && (
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                  className="accent-[#0075FF]"
                />
                Notificar a todo el equipo <span className="text-slate-400">(campanita)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={email}
                  onChange={(e) => setEmail(e.target.checked)}
                  className="accent-[#0075FF]"
                />
                Enviar también por email{' '}
                <span className="text-slate-400">(para novedades importantes)</span>
              </label>
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="primary" onClick={onClose}>
            {publishLabel[timing]}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}
