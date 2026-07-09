import { X } from 'lucide-react';
import { Card, Input, Select, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAccount } from '@/types';

export function AccountCoverageTab({ account }: { account: PrAccount }) {
  const total = account.coverage.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr]">
          <Input label="Medio" />
          <Input label="Título" />
          <Select label="Tipo" defaultValue="Online">
            <option>Online</option>
            <option>Prensa</option>
            <option>Radio / TV</option>
          </Select>
          <Input label="Valor (€)" defaultValue="0" />
        </div>
        <div className="grid items-end gap-4 md:grid-cols-[1.2fr_2.5fr_0.8fr]">
          <Input label="Fecha" type="date" />
          <Input label="Enlace" placeholder="https://..." />
          <Button>Añadir</Button>
        </div>
      </Card>

      <p className="text-right text-xs text-slate-400">
        Valor total de cobertura: <span className="font-semibold text-slate-800">{formatCurrency(total)}</span>
      </p>

      <div className="space-y-3">
        {account.coverage.map((item) => (
          <Card key={item.id} className="flex items-center gap-4 p-4">
            <span className="w-24 shrink-0 text-xs text-slate-400">{item.date}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">
                {item.outlet} · {item.channel}
              </p>
            </div>
            <span className="text-sm font-medium text-slate-800">{formatCurrency(item.value)}</span>
            <button type="button" aria-label="Eliminar cobertura" className="text-slate-300 hover:text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
