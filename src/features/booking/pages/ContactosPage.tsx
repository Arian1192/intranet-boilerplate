import { useState } from 'react';
import { cn } from '@/lib/utils';
import { VenueCard } from '@/features/booking/components';
import { OrgExplorer } from '@/features/crm/components/OrgExplorer';
import { venues } from '../data/contactos';
import {
  eventosPromotoras,
  filtrarEventos,
  BADGE_EVENTO,
  PLACEHOLDER_EVENTOS,
} from '../data/contactos-eventos';
import {
  personasContacto,
  filtrarPersonas,
  PLACEHOLDER_PERSONAS,
} from '../data/contactos-personas';

const PESTANAS = ['Venues', 'Eventos / Promotoras', 'Empresas', 'Personas'] as const;
type Pestana = (typeof PESTANAS)[number];

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function ContactosPage() {
  const [pestana, setPestana] = useState<Pestana>('Venues');
  /** El buscador de arriba: uno solo para toda la pantalla, como el live. */
  const [busqueda, setBusqueda] = useState('');
  /** Eventos / Promotoras tiene ADEMÁS el suyo propio. */
  const [busquedaEventos, setBusquedaEventos] = useState('');

  const q = normalizar(busqueda.trim());
  const venuesVisibles = q
    ? venues.filter((v) => normalizar(v.name).includes(q) || normalizar(v.city ?? '').includes(q))
    : venues;
  const eventosVisibles = filtrarEventos(
    filtrarEventos(eventosPromotoras, busqueda),
    busquedaEventos
  );
  const personasVisibles = filtrarPersonas(personasContacto, busqueda);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-800">Contactos</h1>
        <p className="text-sm text-slate-500">Venues y empresas con las que trabaja ConceptOne.</p>
      </div>

      {/*
        Un solo buscador para toda la pantalla, encima de las pestañas. El
        nuestro estaba dentro de Venues y sólo servía para venues.
      */}
      <div className="mb-5">
        <input
          type="search"
          autoComplete="off"
          className="input w-full sm:max-w-md"
          placeholder={PLACEHOLDER_PERSONAS}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div role="tablist" className="mb-5 flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
        {PESTANAS.map((opcion) => (
          <button
            key={opcion}
            type="button"
            role="tab"
            aria-selected={pestana === opcion}
            onClick={() => setPestana(opcion)}
            className={cn(
              'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm',
              pestana === opcion
                ? 'border-brand-300 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            )}
          >
            {opcion}
          </button>
        ))}
      </div>

      {pestana === 'Venues' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
            {/* Alta: inerte a propósito, y sin pulsar en el live (§3.2). */}
            <button type="button" className="btn-primary text-sm">
              + Nuevo venue
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {venuesVisibles.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        </div>
      )}

      {pestana === 'Eventos / Promotoras' && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="search"
              className="input h-9 flex-1"
              placeholder={PLACEHOLDER_EVENTOS}
              value={busquedaEventos}
              onChange={(e) => setBusquedaEventos(e.target.value)}
            />
            <button type="button" className="btn-primary shrink-0 text-sm">
              + Nuevo
            </button>
          </div>
          <div className="card divide-y divide-slate-100">
            {eventosVisibles.map((evento) => (
              <button
                key={evento.nombre}
                type="button"
                aria-label={`${evento.tipo} ${evento.nombre}`}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
              >
                <span className={cn('badge shrink-0', BADGE_EVENTO)}>{evento.tipo}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                  {evento.nombre}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/*
        La pestaña «Empresas» del live NO es una lista: es el explorador de
        organizaciones del CRM, el mismo que hay en `/crm`. Se reutiliza en vez
        de duplicarlo, y sin su buscador propio — aquí manda el de arriba.
      */}
      {pestana === 'Empresas' && <OrgExplorer mostrarBuscador={false} />}

      {pestana === 'Personas' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button type="button" className="btn-primary text-sm">
              + Nueva persona
            </button>
          </div>
          <ul className="card divide-y divide-slate-100">
            {personasVisibles.map((persona) => (
              <li key={persona.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-slate-800">
                      {persona.nombre}
                      {persona.rol && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          {persona.rol}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{persona.email}</span>
                  </span>
                  <span className="hidden shrink-0 flex-wrap justify-end gap-1 sm:flex">
                    {persona.organizacion && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                        {persona.organizacion}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
