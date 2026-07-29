import { Avatar, MasterDetailList } from '@/components/ui';
import {
  artistasEstrategia,
  FRENTES_ESTRATEGIA,
  VACIO_ESTRATEGIA,
  type ArtistaEstrategia,
} from '../data/estrategias';

export function EstrategiasPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Estrategias · Management</h1>
      <p className="text-sm text-slate-500">
        Estrategia de crecimiento por artista: shows, música, patrocinios y conexiones.
      </p>

      <MasterDetailList<ArtistaEstrategia>
        className="mt-5"
        items={artistasEstrategia}
        emptyState={VACIO_ESTRATEGIA}
        renderRow={(artista) => (
          <span className="flex items-center gap-3">
            <Avatar fallback={artista.nombre} size="sm" />
            <span className="text-sm text-slate-700">{artista.nombre}</span>
          </span>
        )}
        renderDetail={(artista) => (
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{artista.nombre}</h2>
            <div className="mt-4 space-y-4">
              {FRENTES_ESTRATEGIA.map((frente) => (
                <section key={frente}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {frente}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">Sin plan definido todavía.</p>
                </section>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
}
