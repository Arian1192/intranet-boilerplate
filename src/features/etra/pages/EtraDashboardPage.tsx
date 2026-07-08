import { Link } from 'react-router';
import { StatCard, ActivityListItem } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { usePrDashboard } from '../hooks/usePrDashboard';

export function EtraDashboardPage() {
  const { data, isLoading, error } = usePrDashboard();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Comunicación & PR</h1>
          <p className="text-sm text-slate-500">Resumen del espacio de PR y comunicación.</p>
        </div>
        <Link
          to="/etra/cuentas"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          Ver cuentas
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cuentas activas" value={String(data.activeAccounts)} />
        <StatCard label="Cuentas totales" value={String(data.totalAccounts)} />
        <StatCard label="Facturación este mes" value={formatCurrency(data.billingThisMonth)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Próximas acciones</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4 shadow-sm">
            {data.upcomingActions.map((item) => (
              <ActivityListItem
                key={item.id}
                date={item.date}
                title={item.title}
                meta={item.meta}
                badge={item.badge ? { label: item.badge, variant: 'amber' } : undefined}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Cobertura reciente</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4 shadow-sm">
            {data.recentCoverage.map((item) => (
              <ActivityListItem key={item.id} date={item.date} title={item.title} meta={item.meta} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
