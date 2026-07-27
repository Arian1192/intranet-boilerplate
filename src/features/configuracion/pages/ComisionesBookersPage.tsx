import { useState } from 'react';
import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { BookerCommissionRow } from '../components/BookerCommissionRow';
import { commissionSettings, bookerCommissions, type BookerCommission } from '../data/comisiones';

export function ComisionesBookersPage() {
  const seedSettings = commissionSettings();
  const [globalPercent, setGlobalPercent] = useState(seedSettings.globalPercent);
  const [windowDays, setWindowDays] = useState(seedSettings.exclusivityWindowDays);
  const [radiusKm, setRadiusKm] = useState(seedSettings.exclusivityRadiusKm);
  const [jumpKm, setJumpKm] = useState(seedSettings.logisticJumpKm);
  const [bookers, setBookers] = useState<BookerCommission[]>(bookerCommissions());

  const setBookerPercent = (bookerName: string, percent: number) =>
    setBookers((list) => list.map((b) => (b.bookerName === bookerName ? { ...b, percent } : b)));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Comisiones de bookers"
        subtitle="La comisión se calcula sobre el Booking Fee del show. Cada booker tiene su propio %; si un artista concreto tiene un override, ese manda (se configura en la ficha del artista). El booker oficial y el aprobador de arte también se asignan en la ficha del artista."
      />

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Porcentaje global por defecto</h3>
        <label className="mt-3 block text-sm text-slate-600">% sobre el Booking Fee</label>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={globalPercent}
              onChange={(e) => setGlobalPercent(Number(e.target.value))}
              className="h-10 w-20 rounded-lg border border-slate-200 px-2 text-sm"
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
          <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Se aplica a los bookers que no tengan un % propio abajo.</p>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Exclusividad y logística de agenda</h3>
        <p className="mt-1 text-xs text-slate-400">
          Valores por defecto para avisar de conflictos al crear un show. Se pueden ajustar en cada show. La distancia
          real (km) se calcula cuando el venue tiene coordenadas (autocompletado de Google).
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-slate-600">Ventana (días)</label>
            <input type="number" value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Radio de exclusividad (km)</label>
            <input type="number" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Salto logístico máx. (km)</label>
            <input type="number" value={jumpKm} onChange={(e) => setJumpKm(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Exclusividad: otro show del artista dentro de la ventana de días y del radio en km. Salto logístico: dos
          shows a 1-2 días pero más lejos que este límite (viaje inviable).
        </p>
      </Card>

      <Card className="p-0">
        <h3 className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          % de comisión por booker
        </h3>
        <div className="px-5">
          {bookers.map((b) => (
            <BookerCommissionRow
              key={b.bookerName}
              bookerName={b.bookerName}
              percent={b.percent}
              globalPercent={globalPercent}
              onChange={(p) => setBookerPercent(b.bookerName, p)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
