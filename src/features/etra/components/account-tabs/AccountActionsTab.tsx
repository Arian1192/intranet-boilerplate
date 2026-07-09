import { Card, Input, Select, Button, Badge } from '@/components/ui';
import { usePrActions } from '../../hooks/usePrActions';
import type { PrAccount, ActionStatus } from '@/types';

const STATUS_BADGE: Record<ActionStatus, { label: string; variant: 'blue' | 'amber' | 'emerald' | 'neutral' }> = {
  planned: { label: 'Planificada', variant: 'blue' },
  'in-progress': { label: 'En curso', variant: 'amber' },
  done: { label: 'Hecha', variant: 'emerald' },
  cancelled: { label: 'Cancelada', variant: 'neutral' },
};

export function AccountActionsTab({ account }: { account: PrAccount }) {
  const { data, isLoading } = usePrActions();
  const actions = (data ?? []).filter((action) => action.account === account.name);

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Input label="Título de la acción" />
          <Select label="Tipo" defaultValue="Nota de prensa">
            <option>Nota de prensa</option>
            <option>Evento</option>
            <option>Campaña</option>
          </Select>
          <Input label="Fecha límite" type="date" />
        </div>
        <div className="grid items-end gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Select label="Responsable" defaultValue="Sin asignar">
            <option>Sin asignar</option>
            <option>Ana López</option>
            <option>Carlos Ruiz</option>
          </Select>
          <label className="flex h-10 items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand-600" />
            Incluida en fee
          </label>
          <Button>Crear</Button>
        </div>
      </Card>

      {isLoading && <p className="text-slate-500">Cargando...</p>}
      <div className="space-y-3">
        {actions.map((action) => (
          <Card key={action.id} className="flex items-center gap-4 p-4">
            <span className="w-24 shrink-0 text-xs text-slate-400">{action.date}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{action.title}</p>
              <p className="text-xs text-slate-400">{action.type}</p>
            </div>
            <Badge variant={STATUS_BADGE[action.status].variant} size="sm">
              {STATUS_BADGE[action.status].label}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
