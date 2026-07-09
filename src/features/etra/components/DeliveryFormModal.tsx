import { useState } from 'react';
import { Modal, SegmentedControl, Input, Select, Button } from '@/components/ui';
import type { DeliveryMethod } from '@/types';

const METHOD_OPTIONS: { label: string; value: DeliveryMethod }[] = [
  { label: 'Envío MRW', value: 'mrw' },
  { label: 'Entrega en mano', value: 'hand' },
  { label: 'Uso interno', value: 'internal' },
];

const today = () => new Date().toISOString().slice(0, 10);

export function DeliveryFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<DeliveryMethod>('mrw');

  return (
    <Modal open={open} onClose={onClose} title="Nueva entrega">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Método</p>
          <SegmentedControl fullWidth options={METHOD_OPTIONS} value={method} onChange={setMethod} />
        </div>

        <Input label="Cliente / campaña" placeholder="Cliente (opcional)..." />

        {method === 'internal' ? (
          <div className="space-y-2">
            <Select label="¿Quién se lo queda? *" defaultValue="">
              <option value="">Persona del equipo...</option>
              <option>Ana López</option>
              <option>Carlos Ruiz</option>
            </Select>
            <Input placeholder="...o escribe un nombre" />
          </div>
        ) : (
          <Select label="Influencer *" defaultValue="">
            <option value="">Selecciona...</option>
            <option>Carlos Ruiz</option>
            <option>María García</option>
          </Select>
        )}

        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Piezas</p>
          <div className="flex gap-3">
            <Select defaultValue="" className="flex-1">
              <option value="">Referencia...</option>
              <option>REF-0001 · Gorra Edición Limitada</option>
            </Select>
            <Input defaultValue="1" className="w-20" />
          </div>
          <button type="button" className="mt-2 text-sm text-brand-600 hover:text-brand-700">
            + Añadir pieza
          </button>
        </div>

        {method === 'internal' ? (
          <Input label="Fecha" type="date" defaultValue={today()} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fecha" type="date" defaultValue={today()} />
            <Select label="Estado" defaultValue="prepared">
              <option value="prepared">Preparado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </Select>
          </div>
        )}

        {method === 'mrw' && (
          <div className="grid grid-cols-3 gap-3">
            <Input label="Transportista" defaultValue="MRW" />
            <Input label="Tracking" />
            <Input label="Coste (€)" defaultValue="0" />
          </div>
        )}

        <Input label={method === 'hand' ? 'Notas (lugar / evento...)' : 'Notas'} />

        <div className="flex gap-3">
          <Button>Crear entrega</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
}
