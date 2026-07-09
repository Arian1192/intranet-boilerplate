import { MessageCircle, Paperclip, X } from 'lucide-react';
import { Card, Input, Select, Button, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PrAction, BudgetLineStatus } from '@/types';

const LINE_STATUS: Record<BudgetLineStatus, { label: string; className: string }> = {
  paid: { label: 'Abonado', className: 'bg-emerald-100 text-emerald-700' },
  'pending-payment': { label: 'Pendiente abonar', className: 'bg-amber-100 text-amber-700' },
  proposed: { label: 'Propuesto', className: 'bg-white text-slate-700' },
};

export function ActionBreakdownCard({ action }: { action: PrAction }) {
  const budget = action.amount;
  const commissionPct = action.commissionPct ?? 0;
  const commission = (budget * commissionPct) / 100;
  const available = budget - commission;
  const lines = action.budgetLines ?? [];
  const spent = lines.reduce((sum, line) => sum + line.amount, 0);
  const remaining = available - spent;

  const boxes = [
    { label: 'Budget', value: formatCurrency(budget), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: `Comisión agencia (${commissionPct}%)`, value: formatCurrency(-commission), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: 'Disponible', value: formatCurrency(available), boxClassName: 'border-blue-100 bg-blue-50', valueClassName: 'text-blue-700' },
    { label: 'Gastado', value: formatCurrency(-spent), boxClassName: '', valueClassName: 'text-slate-800' },
    { label: 'Restante', value: formatCurrency(remaining), boxClassName: 'border-emerald-100 bg-emerald-50', valueClassName: 'text-emerald-700' },
  ];

  return (
    <Card className="space-y-5 p-6">
      <h2 className="font-semibold text-slate-800">Desglose de la activación</h2>

      <div className="grid gap-3 md:grid-cols-5">
        {boxes.map((box) => (
          <div
            key={box.label}
            className={cn('rounded-xl border border-slate-100 p-4 text-center', box.boxClassName)}
          >
            <p className={cn('font-semibold', box.valueClassName)}>{box.value}</p>
            <p className="mt-1 text-xs text-slate-500">{box.label}</p>
          </div>
        ))}
      </div>

      <div>
        <ProgressBar value={spent} max={available} />
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <span>Gastado {formatCurrency(spent)}</span>
          <span>
            Queda {formatCurrency(remaining)} de {formatCurrency(available)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center gap-3">
            <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-800">
              {line.description}
            </div>
            <div className="flex h-10 w-28 items-center justify-end rounded-lg border border-slate-200 px-3 text-sm text-slate-800">
              {line.amount}
            </div>
            <span className="text-sm text-slate-400">€</span>
            <Select
              defaultValue={line.status}
              className={cn('h-9 w-44', LINE_STATUS[line.status].className)}
            >
              <option value="paid">Abonado</option>
              <option value="pending-payment">Pendiente abonar</option>
              <option value="proposed">Propuesto</option>
            </Select>
            <button type="button" aria-label="Comentar línea" className="text-slate-300 hover:text-slate-500">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
            >
              <Paperclip className="h-3.5 w-3.5" />
              adjuntar
            </button>
            <button type="button" aria-label="Eliminar línea" className="text-slate-300 hover:text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1.2fr_1.2fr_1.2fr]">
          <Input placeholder="Descripción" />
          <Input defaultValue="0" />
          <Select defaultValue="proposed">
            <option value="proposed">Propuesto</option>
            <option value="pending-payment">Pendiente abonar</option>
            <option value="paid">Abonado</option>
          </Select>
          <Input placeholder="Proveedor" />
          <Input placeholder="Enlace" />
        </div>
        <div className="flex gap-3">
          <Input placeholder="Notas internas (opcional)" className="flex-1" />
          <Button>Añadir línea</Button>
        </div>
      </div>
    </Card>
  );
}
