import { useState } from 'react';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface AccountFormProps {
  onSave?: () => void;
}

const SERVICES = ['Redes sociales', 'Paid media', 'Contenido'] as const;
type Service = (typeof SERVICES)[number];

function ServiceChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      )}
    >
      {children}
    </button>
  );
}

export function AccountForm({ onSave }: AccountFormProps) {
  const [internal, setInternal] = useState(false);
  const [services, setServices] = useState<Set<Service>>(new Set());

  const toggleService = (service: Service) => {
    setServices((current) => {
      const next = new Set(current);
      if (next.has(service)) {
        next.delete(service);
      } else {
        next.add(service);
      }
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Nueva cuenta</h2>

      <Input label="Nombre de la cuenta *" placeholder="Nombre del cliente o marca" />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={internal}
          onChange={(event) => setInternal(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-slate-700">Cuenta interna del grupo (no es cliente externo)</span>
      </label>

      <div>
        <Input label="Cliente en el CRM" placeholder="Buscar o crear cliente…" />
        <p className="mt-1.5 text-xs text-slate-500">
          Enlaza la cuenta con la ficha del cliente en el CRM del grupo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Estado" defaultValue="Activa">
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Inactiva">Inactiva</option>
        </Select>
        <Input label="Retainer mensual (€)" placeholder="Opcional" />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700">Servicios</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <ServiceChip key={service} active={services.has(service)} onClick={() => toggleService(service)}>
              {service}
            </ServiceChip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Responsable" defaultValue="">
          <option value="">Sin asignar</option>
        </Select>
        <div>
          <Select label="Resp. de aprobar" defaultValue="">
            <option value="">Sin asignar</option>
          </Select>
          <p className="mt-1.5 text-xs text-slate-500">Se autocompleta en las piezas de esta cuenta.</p>
        </div>
      </div>

      <Textarea label="Notas" placeholder="Alcance, condiciones, observaciones…" />

      <div className="flex justify-end">
        <Button onClick={() => onSave?.()}>Guardar</Button>
      </div>
    </div>
  );
}
