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

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Advancing
              </h2>
              <span className="text-xs font-normal normal-case text-slate-400">
                · Contrato · pagos · detalles
              </span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.advancing.length}
            </span>
          </div>
          <div className="max-h-[340px] divide-y divide-slate-100 overflow-y-auto">
            {data.advancing.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Logística
              </h2>
              <span className="text-xs font-normal normal-case text-slate-400">
                · Itinerario · vuelos · set times
              </span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {data.logistics.length}
            </span>
          </div>
          <div className="max-h-[340px] divide-y divide-slate-100 overflow-y-auto">
            {data.logistics.map((item) => (
              <ShowListItem key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Próximos shows
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data.upcomingShows.map((item) => (
              <ShowListItem key={item.id} item={item} variant="upcoming" />
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Notas urgentes
            </h2>
          </div>
          <div className="p-5">
            <form
              className="mb-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setNote('');
              }}
            >
              <Input
                placeholder="Añadir nota…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="shrink-0 px-3">
                +
              </Button>
            </form>
            <p className="py-4 text-center text-sm text-slate-400">Sin notas pendientes.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
