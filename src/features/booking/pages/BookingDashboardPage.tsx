import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Input, Button } from '@/components/ui';
import {
  KpiCard,
  ShowListItem,
  FichasRevisarBanner,
  PosiblesGigsPanel,
} from '@/features/booking/components';
import { NovedadesPanel } from '@/features/booking/components/NovedadesPanel';
import { NOVEDADES } from '../data/novedades';
import { useBookingDashboard } from '../hooks/useBookingDashboard';

/**
 * `/conceptone` — recalco contra el live del 2026-09-09.
 *
 * El orden de los bloques es el del live y **no** el que teníamos: cabecera con
 * el enlace a Shows, tira de pipeline, `Novedades`, `Advancing`, `Logística`,
 * `Notas urgentes`, `Fichas a revisar` y `Posibles gigs`. Las dos últimas
 * estaban arriba y van al final.
 *
 * **El live ya no tiene el bloque «Próximos shows»**, así que aquí tampoco. El
 * dato (`data.upcomingShows`) sigue viniendo del repositorio y no se ha tocado:
 * si resulta que el live lo movió a otro sitio en vez de quitarlo, volver a
 * pintarlo es añadir una `Card`, no recuperar nada.
 *
 * Las cifras son las del `MockRepository` y **no** las del live: la Fase E es
 * recalco de estructura, no de volumen (decisión del coordinador). El live tenía
 * ese día `70.479,07 € · 100` en Tentative; nosotros seguimos con los nuestros.
 */

export function BookingDashboardPage() {
  const { data, isLoading, error } = useBookingDashboard();
  const navegar = useNavigate();
  const [note, setNote] = useState('');

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">Dashboard</h1>
        <button
          type="button"
          onClick={() => navegar('/shows')}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
        >
          <span className="hidden sm:inline">Ir a todos los shows</span>
          <span className="sm:hidden">Ver shows</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Siete columnas para seis tiles: es la rejilla del live, no un descuido. */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <NovedadesPanel novedades={NOVEDADES} />

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

      <Card className="mb-6 overflow-hidden p-0">
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

      <div className="mb-4">
        <FichasRevisarBanner fichas={data.fichasRevisar} />
      </div>

      <div>
        <PosiblesGigsPanel gigs={data.posiblesGigs} />
      </div>
    </div>
  );
}
