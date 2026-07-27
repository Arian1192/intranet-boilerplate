import { useState } from 'react';
import { EstiloChips, MensajeDisponibilidad, AgendaShowCard } from '@/features/booking/components';
import { artistasLibres, mensajeDisponibilidad } from '../data/disponibilidad';
import { eventsForDay } from '../data/calendar';

export function DisponibilidadPage() {
  const [fechaISO, setFechaISO] = useState('2026-07-24');
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const mensaje = mensajeDisponibilidad(fecha);
  const conShow = eventsForDay(fechaISO).filter((e) => e.type === 'show');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Disponibilidad</h1>
        <p className="mt-1 text-sm text-slate-500">
          Elige una fecha (y estilo, si quieres) y comparte al instante qué artistas están libres.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="dispo-fecha" className="mb-1.5 block text-sm font-medium text-slate-700">
          Fecha
        </label>
        <input
          id="dispo-fecha"
          type="date"
          aria-label="Fecha"
          value={fechaISO}
          onChange={(event) => setFechaISO(event.target.value)}
          className="h-10 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <p className="mb-2 mt-4 text-sm text-slate-500">
          Estilo <span className="text-slate-400">(opcional)</span>
        </p>
        <EstiloChips />
      </div>

      <MensajeDisponibilidad libres={artistasLibres.length} mensaje={mensaje} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500">
          CON SHOW ESE DÍA
        </h2>
        {conShow.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Nadie tiene show esa fecha.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-100">
            {conShow.map((e) => (
              <AgendaShowCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
