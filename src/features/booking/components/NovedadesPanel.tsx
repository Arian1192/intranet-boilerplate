import { cuandoNovedad, textoNovedad, type Novedad } from '../data/novedades';

/**
 * Feed `Novedades` del dashboard de ConceptOne — calco del live del 2026-09-09.
 *
 * Va justo debajo de la tira de KPI, que es donde lo pone el live, y es la
 * primera de sus cuatro `section.card`.
 *
 * La bajada se esconde en móvil (`hidden … sm:block`) y el rótulo se escribe
 * `Novedades`: las mayúsculas las pone el `uppercase` del CSS, como en el resto
 * de cabeceras del módulo.
 *
 * Cada evento es un `button` porque en el live lo es. No se le pone acción: en
 * el live lleva al contrato, y esa pantalla no existe todavía en nuestro router.
 */
export interface NovedadesPanelProps {
  novedades: Novedad[];
}

export function NovedadesPanel({ novedades }: NovedadesPanelProps) {
  return (
    <section className="card mb-4 overflow-hidden rounded-none border-x-0 sm:mb-6 sm:rounded-xl sm:border-x">
      <div className="flex flex-col gap-0.5 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Novedades</h2>
        <span className="hidden text-xs text-slate-400 sm:block">
          Lo que hacen los promotores con sus correos y contratos
        </span>
      </div>
      <div className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto overflow-x-hidden sm:max-h-[360px]">
        {novedades.map((novedad, i) => (
          <button
            // El live repite artista, hito y hora en varias filas del mismo
            // contrato, así que ninguna combinación de campos es única: la
            // posición es la única clave estable que hay.
            key={`${novedad.referencia}-${i}`}
            type="button"
            className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left hover:bg-slate-50 sm:px-5"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-slate-700">
                <span className="font-medium text-slate-800">{novedad.artista}</span> ·{' '}
                {textoNovedad(novedad)}
              </div>
              <div className="text-xs text-slate-400">
                {cuandoNovedad(novedad.cuando)} · {novedad.referencia}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
