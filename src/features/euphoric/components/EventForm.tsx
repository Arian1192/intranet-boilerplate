import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';

export interface EventFormProps {
  onSave?: () => void;
}

export function EventForm({ onSave }: EventFormProps) {
  const [producedByBlackMoose, setProducedByBlackMoose] = useState(false);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Nuevo evento</h2>

      <Input label="Nombre *" placeholder="Ej: OFF BCN · Ku · 12 jul" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Fecha inicio" type="date" />
        <Input label="Fecha fin (opc.)" type="date" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Ciudad" />
        <Input label="Venue (CRM)" placeholder="Buscar o crear venue…" />
      </div>

      <Textarea label="Descripción" />

      <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
        <input
          type="checkbox"
          checked={producedByBlackMoose}
          onChange={(event) => setProducedByBlackMoose(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span>
          <span className="block font-medium text-slate-800">La produce Black Moose</span>
          <span className="mt-0.5 block text-sm text-slate-500">
            Activa el módulo de Producción: el evento aparecerá también en el espacio de Producción. Déjalo
            desmarcado si solo llevamos la comunicación/marketing.
          </span>
        </span>
      </label>

      <div className="flex justify-end">
        <Button onClick={() => onSave?.()}>Guardar</Button>
      </div>
    </div>
  );
}
