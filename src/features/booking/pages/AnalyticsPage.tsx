import { StatCard, ChartPlaceholder } from '@/features/booking/components';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Analítica</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Evolución mensual" />
        <ChartPlaceholder title="Distribución por estado" />
      </div>
    </div>
  );
}
