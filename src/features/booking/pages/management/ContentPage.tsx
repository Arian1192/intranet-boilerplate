import { useMemo, useState } from 'react';
import { ApxDd } from '@/features/booking/components/ApxDd';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import {
  FASES_CONTENT,
  PROYECTOS_CONTENT,
  type ProyectoContent,
} from '@/features/booking/data/management-content';

/** El live escribe «1 proyecto» y «0 proyectos»; medido filtrando. */
function contador(n: number) {
  return n === 1 ? '1 proyecto' : `${n} proyectos`;
}

/**
 * `/management/content` — calco del live del 2026-09-09.
 *
 * Tablero de cinco columnas con un único proyecto en `Idea`; las otras cuatro
 * pintan el guion sobre borde discontinuo que usa el live para el vacío.
 *
 * Las flechas mueven la tarjeta de columna y `Eliminar` la quita, ambas sobre el
 * seed en local: es lo mismo que hacen los interruptores de
 * `/management/roster`. La `◄` va deshabilitada en la primera columna, como en
 * el live; la `►` de la última también, por simetría — el live no tiene ninguna
 * tarjeta en `Entregado` con la que medirlo, y dejarla activa sacaría la tarjeta
 * del tablero.
 *
 * El cuerpo de la tarjeta es un `button` porque en el live abre el modal
 * `Editar proyecto`, que es la **Fase G**: aquí se deja sin acción todavía.
 */
export function ContentPage() {
  const [proyectos, setProyectos] = useState<ProyectoContent[]>(PROYECTOS_CONTENT);
  const [artista, setArtista] = useState<string | null>(null);

  const visibles = useMemo(
    () => proyectos.filter((p) => !artista || p.artista === artista),
    [proyectos, artista]
  );

  const mover = (titulo: string, salto: 1 | -1) =>
    setProyectos((previos) =>
      previos.map((p) => {
        if (p.titulo !== titulo) return p;
        const destino = FASES_CONTENT.indexOf(p.fase) + salto;
        return destino >= 0 && destino < FASES_CONTENT.length
          ? { ...p, fase: FASES_CONTENT[destino] }
          : p;
      })
    );

  const borrar = (titulo: string) =>
    setProyectos((previos) => previos.filter((p) => p.titulo !== titulo));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Content</h1>
          <p className="text-sm text-slate-500">
            Pipeline de proyectos creativos del roster: del brief a la entrega.
          </p>
        </div>
        <button type="button" className="btn-primary text-sm">
          + Nuevo proyecto
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ApxDd
          todas="Todos los artistas"
          opciones={ARTISTAS_MANAGEMENT}
          valor={artista}
          onCambio={setArtista}
          ancho="w-52"
        />
        <span className="ml-auto text-xs text-slate-400">{contador(visibles.length)}</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {FASES_CONTENT.map((fase, columna) => {
          const enFase = visibles.filter((p) => p.fase === fase);
          return (
            <div key={fase} className="w-64 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-slate-600">{fase}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {enFase.length}
                </span>
              </div>
              <div className="space-y-2">
                {enFase.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-300">
                    —
                  </div>
                ) : (
                  enFase.map((proyecto) => (
                    <div key={proyecto.titulo} className="card p-3">
                      {/* En el live abre el modal `Editar proyecto` — Fase G. */}
                      <button type="button" className="w-full text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                            {proyecto.titulo}
                          </span>
                          <span className="badge bg-slate-100 text-[10px] text-slate-500">
                            {proyecto.tipo}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-slate-400">
                          {proyecto.producidoPor
                            ? `${proyecto.artista} · ${proyecto.producidoPor}`
                            : proyecto.artista}
                        </div>
                        {/* El live deja esta tira vacía en el único proyecto que
                            tiene; ahí es donde pinta fechas e importes. */}
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400" />
                      </button>
                      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
                        <button
                          type="button"
                          disabled={columna === 0}
                          onClick={() => mover(proyecto.titulo, -1)}
                          className="text-xs text-slate-400 hover:text-brand-600 disabled:opacity-30"
                        >
                          ◄
                        </button>
                        <button
                          type="button"
                          onClick={() => borrar(proyecto.titulo)}
                          className="text-[11px] text-slate-300 hover:text-rose-600"
                        >
                          Eliminar
                        </button>
                        <button
                          type="button"
                          disabled={columna === FASES_CONTENT.length - 1}
                          onClick={() => mover(proyecto.titulo, 1)}
                          className="text-xs text-slate-400 hover:text-brand-600 disabled:opacity-30"
                        >
                          ►
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
