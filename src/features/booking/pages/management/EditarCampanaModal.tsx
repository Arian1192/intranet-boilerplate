import { useState } from 'react';
import { ApxDp } from '@/features/booking/components/ApxDp';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import {
  CANALES_CAMPANA,
  ESTADOS_CAMPANA,
  ESTRATEGIAS_POR_ARTISTA,
  PAGA_CAMPANA,
  type Campana,
  type CanalCampana,
  type EstadoCampana,
  type PagaCampana,
} from '@/features/booking/data/management-campanas';

/**
 * Modal `Editar campaña` — calco del live del 2026-09-09
 * (`docs/references/conceptone-v3-2026-09-09/f2-management--campanas-detalle.main.html`,
 * y los once modales campo a campo en `f2d-management--campanas-{modales,opciones}.txt`).
 *
 * Trece campos, en el orden y con los rótulos del live. Los desplegables son
 * `<select class="input h-9 w-full">` nativos porque eso es lo que usa el live
 * aquí: **no** el `dd` de la carcasa. Los de fecha sí son el `dp`, y por eso
 * usan `ApxDp`.
 *
 * Dos listas dependen del artista elegido y se recalculan al cambiarlo, que es
 * lo medido abriendo los once modales:
 *
 * - `Estrategia` ofrece sólo las de ese artista (`ESTRATEGIAS_POR_ARTISTA`).
 * - `Campaña madre` ofrece las **otras** campañas de ese artista. Con Abdon
 *   puesto, el live lista sus dos campañas restantes y no la que se está
 *   editando.
 *
 * `Guardar` sale deshabilitado mientras el nombre esté vacío: el live le pone
 * `disabled:opacity-50` a ese botón, y sin nombre no hay campaña que guardar.
 */
export interface EditarCampanaModalProps {
  campana: Campana;
  /** El resto de campañas, para poder ofrecer la «campaña madre». */
  todas: readonly Campana[];
  onGuardar: (campana: Campana) => void;
  onCancelar: () => void;
  onEliminar: () => void;
}

export function EditarCampanaModal({
  campana,
  todas,
  onGuardar,
  onCancelar,
  onEliminar,
}: EditarCampanaModalProps) {
  const [borrador, setBorrador] = useState<Campana>(campana);

  const cambiar = <C extends keyof Campana>(campo: C, valor: Campana[C]) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }));

  const estrategias = ESTRATEGIAS_POR_ARTISTA[borrador.artista] ?? [];
  const madres = todas.filter(
    (c) => c.artista === borrador.artista && c.nombre !== campana.nombre
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Editar campaña</h2>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700"
            aria-label="Cerrar"
            onClick={onCancelar}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-nombre">
              Nombre
            </label>
            <input
              id="campana-nombre"
              className="input h-9 w-full"
              placeholder="p. ej. Lanzamiento single X — Meta"
              value={borrador.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-artista">
                Artista
              </label>
              <select
                id="campana-artista"
                className="input h-9 w-full"
                value={borrador.artista}
                onChange={(e) => cambiar('artista', e.target.value)}
              >
                <option value="">— Elige —</option>
                {ARTISTAS_MANAGEMENT.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-estrategia">
                Estrategia{' '}
                <span className="font-normal text-slate-400">(a qué plan pertenece)</span>
              </label>
              <select
                id="campana-estrategia"
                className="input h-9 w-full disabled:bg-slate-50"
                value={borrador.estrategia ?? ''}
                onChange={(e) => cambiar('estrategia', e.target.value || undefined)}
              >
                <option value="">— Sin estrategia —</option>
                {estrategias.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-madre">
                Campaña madre (opcional)
              </label>
              <select
                id="campana-madre"
                className="input h-9 w-full"
                value={borrador.campanaMadre ?? ''}
                onChange={(e) => cambiar('campanaMadre', e.target.value || undefined)}
              >
                <option value="">— Ninguna (es principal) —</option>
                {madres.map((c) => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-canal">
                Canal
              </label>
              <select
                id="campana-canal"
                className="input h-9 w-full"
                value={borrador.canal}
                onChange={(e) => cambiar('canal', e.target.value as CanalCampana)}
              >
                {CANALES_CAMPANA.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-estado">
                Estado
              </label>
              <select
                id="campana-estado"
                className="input h-9 w-full"
                value={borrador.estado}
                onChange={(e) => cambiar('estado', e.target.value as EstadoCampana)}
              >
                {ESTADOS_CAMPANA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-paga">
                Paga
              </label>
              <select
                id="campana-paga"
                className="input h-9 w-full"
                value={borrador.paga}
                onChange={(e) => cambiar('paga', e.target.value as PagaCampana)}
              >
                {PAGA_CAMPANA.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-objetivo">
                Objetivo
              </label>
              <input
                id="campana-objetivo"
                className="input h-9 w-full"
                value={borrador.objetivo ?? ''}
                onChange={(e) => cambiar('objetivo', e.target.value || undefined)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-presupuesto">
                Presupuesto (€)
              </label>
              <input
                id="campana-presupuesto"
                type="number"
                className="input h-9 w-full"
                value={borrador.presupuesto}
                onChange={(e) => cambiar('presupuesto', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-gasto">
                Gasto real (€)
              </label>
              <input
                id="campana-gasto"
                type="number"
                className="input h-9 w-full"
                value={borrador.gasto}
                onChange={(e) => cambiar('gasto', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Inicio</label>
              <ApxDp
                valor={borrador.inicio ?? null}
                onCambio={(v) => cambiar('inicio', v ?? undefined)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Fin</label>
              <ApxDp valor={borrador.fin ?? null} onCambio={(v) => cambiar('fin', v ?? undefined)} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="campana-notas">
              Notas
            </label>
            <textarea
              id="campana-notas"
              className="input min-h-[60px] w-full"
              value={borrador.notas ?? ''}
              onChange={(e) => cambiar('notas', e.target.value || undefined)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-rose-600 hover:underline"
              onClick={onEliminar}
            >
              Eliminar
            </button>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary text-sm" onClick={onCancelar}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary text-sm disabled:opacity-50"
                disabled={!borrador.nombre.trim()}
                onClick={() => onGuardar(borrador)}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
