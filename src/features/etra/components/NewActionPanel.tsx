import { X } from 'lucide-react';
import { Card, Input, Select, Button } from '@/components/ui';

export function NewActionPanel({ onClose }: { onClose: () => void }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Nueva tarea</h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Input label="Título" />
        </div>
        <Select label="Cuenta" defaultValue="">
          <option value="">Selecciona...</option>
          <option>Cliente A</option>
          <option>Cliente B</option>
        </Select>
        <Select label="Tipo" defaultValue="Nota de prensa">
          <option>Nota de prensa</option>
          <option>Evento</option>
          <option>Campaña</option>
        </Select>
        <Select label="Responsable" defaultValue="Sin asignar">
          <option>Sin asignar</option>
          <option>Ana López</option>
          <option>Carlos Ruiz</option>
        </Select>
        <Input label="Fecha límite" type="date" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          Incluida en el fee
        </label>
        <Button>Crear y abrir</Button>
      </div>
    </Card>
  );
}
