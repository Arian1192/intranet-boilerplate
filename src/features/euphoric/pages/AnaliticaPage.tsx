import { Badge, Card, StatCard } from '@/components/ui';
import { RetainerBarChart } from '../components/RetainerBarChart';
import { formatCurrencyEs } from '../data/format';
import { accounts, campaigns, publications, analytics } from '../data/seed';

export function AnaliticaPage() {
  const chartData = accounts.map((account) => ({ label: account.name, value: account.retainer }));
  const maxRetainer = Math.max(...chartData.map((item) => item.value), 0);
  const chartMax = Math.max(Math.ceil(maxRetainer / 200) * 200, 200);

  const investmentPct =
    analytics.campaignBudget > 0 ? Math.round((analytics.campaignSpent / analytics.campaignBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analítica</h1>
        <p className="text-slate-500">
          Cartera de cuentas, ingresos recurrentes (retainers), inversión en campañas y contenido.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="MRR (RETAINERS ACTIVOS)"
          value={formatCurrencyEs(analytics.mrr)}
          valueClassName="text-rose-500"
        />
        <StatCard
          label="CUENTAS ACTIVAS"
          value={String(analytics.activeAccounts)}
          caption={`de ${analytics.totalAccounts}`}
        />
        <StatCard label="PRESUPUESTO CAMPAÑAS" value={formatCurrencyEs(analytics.campaignBudget)} />
        <StatCard
          label="INVERSIÓN CAMPAÑAS"
          value={formatCurrencyEs(analytics.campaignSpent)}
          caption={`${investmentPct}% del presupuesto`}
        />
      </div>

      <Card className="p-5">
        <p className="text-xs font-semibold tracking-wide text-slate-400">RETAINER MENSUAL POR CUENTA</p>
        <div className="mt-4">
          <RetainerBarChart data={chartData} max={chartMax} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <Card className="p-5">
          <p className="text-xs font-semibold tracking-wide text-slate-400">POR CUENTA</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-slate-400">
                  <th className="pb-2 pr-3">CUENTA</th>
                  <th className="pb-2 pr-3">ESTADO</th>
                  <th className="pb-2 pr-3">RETAINER</th>
                  <th className="pb-2 pr-3">CAMPAÑAS</th>
                  <th className="pb-2 pr-3">INVERSIÓN</th>
                  <th className="pb-2">PUBLICACIONES</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const accountCampaigns = campaigns.filter((c) => c.account === account.name).length;
                  const accountPublications = publications.filter((p) => p.account === account.name).length;
                  return (
                    <tr key={account.id} className="border-t border-slate-100">
                      <td className="py-2 pr-3 font-medium text-slate-900">{account.name}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={account.status === 'Activa' ? 'success' : 'neutral'}>{account.status}</Badge>
                      </td>
                      <td className="py-2 pr-3 tabular-nums text-slate-700">{formatCurrencyEs(account.retainer)}</td>
                      <td className="py-2 pr-3 tabular-nums text-slate-700">{accountCampaigns}</td>
                      <td className="py-2 pr-3 text-slate-400">—</td>
                      <td className="py-2 tabular-nums text-slate-700">{accountPublications}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-slate-400">CONTENIDO POR ESTADO</p>
            <ul className="mt-3 space-y-2">
              {analytics.contentByStatus.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium tabular-nums text-slate-900">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-slate-400">CONTENIDO POR CANAL</p>
            <ul className="mt-3 space-y-2">
              {analytics.contentByChannel.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium tabular-nums text-slate-900">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
