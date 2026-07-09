import { Card, Button, ProgressBar } from '@/components/ui';
import type { PrAccount } from '@/types';

export function AccountObligationsTab({ account }: { account: PrAccount }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          KPIS / OBLIGACIONES
        </p>
        <Button variant="secondary" size="sm">Modificar obligaciones</Button>
      </div>

      {account.obligations.length === 0 && (
        <p className="py-8 text-center text-slate-400">Sin obligaciones definidas.</p>
      )}

      {account.obligations.map((obligation) => (
        <Card key={obligation.id} className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-slate-800">{obligation.label}</p>
            <p className="text-xs text-slate-400">
              {obligation.cadence} · {obligation.period}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressBar value={obligation.done} max={obligation.target} className="flex-1" />
            <input
              type="number"
              defaultValue={obligation.done}
              className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
            />
            <span className="text-sm text-slate-400">/ {obligation.target}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
