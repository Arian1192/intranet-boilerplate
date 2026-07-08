import { useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { KpiCard, ShowListItem } from '@/features/booking/components';
import { useBookingDashboard } from '../hooks/useBookingDashboard';

export function BookingDashboardPage() {
  const { data, isLoading, error } = useBookingDashboard();
  const [note, setNote] = useState('');

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold leading-8 text-slate-800">Dashboard</h1>

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Advancing
            </h2>
            <span className="text-xs text-slate-400">· Contrato · pagos · detalles</span>
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.advancing.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.advancing.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Logística
            </h2>
            <span className="text-xs text-slate-400">· Itinerario · vuelos · set times</span>
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.logistics.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.logistics.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Próximos shows
          </h2>
          <div className="divide-y divide-slate-100">
            {data.upcomingShows.map((item) => (
              <ShowListItem key={item.id} item={item} variant="upcoming" />
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Notas urgentes
          </h2>
          <div className="p-5">
            <div className="flex gap-2">
              <Input
                placeholder="Añadir nota..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" className="h-10 w-10 px-0 text-lg">
                +
              </Button>
            </div>
            <p className="py-8 text-center text-sm text-slate-400">Sin notas pendientes.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
