import { Card, Input, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { PrAccount, AccountBillingMonth } from '@/types';

function monthTotal(month: AccountBillingMonth): number {
  return month.retainer + (month.commissions ?? 0) + month.others;
}

export function AccountBillingTab({ account }: { account: PrAccount }) {
  const { billing } = account;
  const retainerTotal = billing.months.reduce((sum, m) => sum + m.retainer, 0);
  const commissionsTotal = billing.months.reduce((sum, m) => sum + (m.commissions ?? 0), 0);
  const othersTotal = billing.months.reduce((sum, m) => sum + m.others, 0);
  const grandTotal = billing.months.reduce((sum, m) => sum + monthTotal(m), 0);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
          <Input label="Retainer mensual (por defecto)" defaultValue={String(billing.defaultRetainer)} />
          <Input label="Comisión por budget (por defecto) %" defaultValue={String(billing.defaultCommissionPct)} />
          <Button>Guardar</Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          El retainer es el fee mensual pactado (se aplica cada mes activo; puedes ajustar un mes concreto en la
          tabla de abajo). La comisión por defecto se aplica a las acciones nuevas con budget de esta cuenta, y
          sigue siendo editable en cada acción.
        </p>
      </Card>

      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Ingresos = <span className="font-semibold text-slate-800">retainer</span> (
        {formatCurrency(billing.defaultRetainer)}/mes por defecto) +{' '}
        <span className="font-semibold text-slate-800">comisiones</span> de acciones con budget + otros.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Mes</th>
              <th className="px-4 py-3 text-right">Retainer</th>
              <th className="px-4 py-3 text-right">Comisiones</th>
              <th className="px-4 py-3 text-right">Otros</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {billing.months.map((month) => (
              <tr key={month.id}>
                <td className="px-4 py-2.5 text-slate-700">{month.label}</td>
                <td className="px-4 py-2.5 text-right">
                  <input
                    type="number"
                    defaultValue={month.retainer}
                    className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
                  />
                </td>
                <td className="px-4 py-2.5 text-right text-slate-700">
                  {month.commissions !== null ? formatCurrency(month.commissions) : '—'}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <input
                    type="number"
                    defaultValue={month.others}
                    className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-right text-sm text-slate-800"
                  />
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                  {formatCurrency(monthTotal(month))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 font-semibold text-slate-800">
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-right">{formatCurrency(retainerTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(commissionsTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(othersTotal)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        El retainer y &quot;otros&quot; son editables por mes (otros admite negativos para restar). Las comisiones
        se calculan solas desde las acciones.
      </p>
    </div>
  );
}
