import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  artistasFicha,
  filtrarArtistas,
  iniciales,
  ARCHIVADOS,
  BADGE_SIN_CONTRATO,
  KPI_BOOKING,
  KPI_MANAGEMENT,
  MOSTRAR_FOTOS,
  PLACEHOLDER_BUSCADOR,
  REDES_ROSTER,
  VACIO_ARTISTAS,
  type ArtistaFicha,
} from '../data/artistas-ficha';

type VistaArtistas = 'Lista' | 'Roster';

/**
 * Avatar del artista. `MOSTRAR_FOTOS` está en `false` a propósito: siempre van
 * las iniciales, que es el fallback que el propio live usa cuando no hay foto.
 */
function Avatar({ artista, tamano }: { artista: ArtistaFicha; tamano: 'fila' | 'tarjeta' }) {
  const medida = tamano === 'fila' ? 'h-8 w-8 text-xs' : 'h-14 w-14 text-sm';
  if (MOSTRAR_FOTOS && artista.fotoUrl) {
    return (
      <img
        src={artista.fotoUrl}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', medida)}
      />
    );
  }
  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-slate-100 font-semibold text-slate-500',
        medida
      )}
    >
      {iniciales(artista.nombre)}
    </div>
  );
}

function InsigniaB() {
  return (
    <span
      className="grid h-5 w-5 place-items-center rounded bg-brand-100 text-[10px] font-bold text-brand-700"
      title="Booking"
    >
      B
    </span>
  );
}

function InsigniaM() {
  return (
    <span
      className="grid h-5 w-5 place-items-center rounded bg-amber-100 text-[10px] font-bold text-amber-700"
      title="Management"
    >
      M
    </span>
  );
}

function TarjetaRoster({ artista }: { artista: ArtistaFicha }) {
  return (
    <div
      className="card cursor-pointer p-4 transition hover:shadow-md hover:ring-1 hover:ring-brand-200"
      role="button"
      tabIndex={0}
      aria-label={`Ficha de ${artista.nombre}`}
    >
      <div className="flex items-center gap-3">
        <Avatar artista={artista} tamano="tarjeta" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-800">{artista.nombre}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            {artista.booking && (
              <span
                title="Booking"
                className="rounded bg-brand-100 px-1.5 py-px text-[10px] font-bold text-brand-700"
              >
                B
              </span>
            )}
            {artista.management && (
              <span
                title="Management"
                className="rounded bg-amber-100 px-1.5 py-px text-[10px] font-bold text-amber-700"
              >
                M
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
        {REDES_ROSTER.map((red) => {
          const enlace = artista.redes[red];
          if (!enlace) {
            return (
              <span
                key={red}
                title={`${red} — sin enlace`}
                className="cursor-default rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {red}
              </span>
            );
          }
          return (
            <a
              key={red}
              href={enlace}
              target="_blank"
              rel="noopener noreferrer"
              title={red}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
            >
              {red}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function ArtistasPage() {
  const [vista, setVista] = useState<VistaArtistas>('Lista');
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => filtrarArtistas(artistasFicha, busqueda), [busqueda]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-800">Artistas</h1>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1"
            title="Artistas con Booking"
          >
            <span className="grid h-5 w-5 place-items-center rounded bg-brand-100 text-[10px] font-bold text-brand-700">
              B
            </span>
            <span className="text-sm font-semibold text-brand-700">{KPI_BOOKING}</span>
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1"
            title="Artistas con Management"
          >
            <span className="grid h-5 w-5 place-items-center rounded bg-amber-100 text-[10px] font-bold text-amber-700">
              M
            </span>
            <span className="text-sm font-semibold text-amber-700">{KPI_MANAGEMENT}</span>
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Ficha completa del artista: condiciones, datos personales, contrato y documentos.
        </p>
      </div>

      <div className="mb-4 inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
        {(['Lista', 'Roster'] as VistaArtistas[]).map((opcion, i) => (
          <button
            key={opcion}
            type="button"
            aria-pressed={vista === opcion}
            onClick={() => setVista(opcion)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium',
              i > 0 && 'border-l border-slate-200',
              vista === opcion ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            {opcion}
          </button>
        ))}
      </div>

      {vista === 'Lista' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
            <button type="button" className="btn-primary mb-3 w-full">
              + Nuevo artista
            </button>
            <div className="relative mb-3">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="search"
                placeholder={PLACEHOLDER_BUSCADOR}
                className="input h-9 pl-9 text-sm"
                autoComplete="off"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="card overflow-hidden">
              <div className="lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
                <ul className="divide-y divide-slate-100">
                  {visibles.map((artista) => (
                    <li key={artista.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-slate-50"
                      >
                        <Avatar artista={artista} tamano="fila" />
                        <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                          {artista.nombre}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          {artista.booking && <InsigniaB />}
                          {artista.management && <InsigniaM />}
                          <span className="badge bg-slate-100 text-slate-500">
                            {BADGE_SIN_CONTRATO}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/*
                El live lo deja plegado y no se llegó a abrir: no se sabe quién
                es el artista archivado, así que el pie se calca inerte.
              */}
              <div className="border-t border-slate-200 bg-slate-50/60">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  <span>Archivados · {ARCHIVADOS}</span>
                  <span>▸</span>
                </button>
              </div>
            </div>
          </section>
          <section className="hidden lg:col-span-2 lg:block">
            <div className="card py-20 text-center text-slate-400">{VACIO_ARTISTAS}</div>
          </section>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artistasFicha.map((artista) => (
            <TarjetaRoster key={artista.id} artista={artista} />
          ))}
        </div>
      )}
    </div>
  );
}
