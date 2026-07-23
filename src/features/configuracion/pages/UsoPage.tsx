import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { StatCard, SegmentedControl } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { UsageBanner } from '../components/UsageBanner';
import { IntegrationRow } from '../components/IntegrationRow';
import { integrations, snapshotFor, totalsFor, usageBanners, type UsagePeriod } from '../data/uso';

const PERIODS: { label: string; value: UsagePeriod }[] = [
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '90 días', value: '90d' },
  { label: 'Un año', value: '1y' },
];

const PERIOD_LABEL: Record<UsagePeriod, string> = {
  '7d': '7 días',
  '30d': '30 días',
  '90d': '90 días',
  '1y': 'un año',
};

export function UsoPage() {
  const [period, setPeriod] = useState<UsagePeriod>('30d');
  const list = integrations();
  const totals = totalsFor(period);
  const banners = usageBanners();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <ConfigPageHeader
          title="Uso del sistema"
          subtitle="Qué integraciones funcionan, cuánto usas cada una y cuánto gastas."
        />
        <SegmentedControl
          tone="dark"
          options={PERIODS}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cuota fija/mes" value={formatCurrency(totals.cuotaFijaMes)} />
        <StatCard
          label={`Gasto total (${PERIOD_LABEL[period]})`}
          value={formatCurrency(totals.gastoTotalPeriodo)}
          caption="Cuota prorrateada + consumo"
        />
        <StatCard label="Errores" value={String(totals.errores)} />
      </div>

      <div className="space-y-3">
        {banners.map((b, i) => (
          <UsageBanner key={i} boldText={b.boldText} text={b.text} linkLabel={b.linkLabel} />
        ))}
      </div>

      <div className="space-y-3">
        {list.map((integration) => (
          <IntegrationRow
            key={integration.id}
            integration={integration}
            snapshot={snapshotFor(integration.id, period)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <button type="button" className="underline hover:text-slate-700">Cuotas y tarifas</button>
        <span>·</span>
        <button type="button" className="underline hover:text-slate-700">Actualizar</button>
      </div>
    </div>
  );
}
