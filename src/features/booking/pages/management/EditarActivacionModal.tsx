import { useState } from 'react';
import { ApxDp } from '@/features/booking/components/ApxDp';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import { CAMPANAS } from '@/features/booking/data/management-campanas';
import {
  TIPOS_ACTIVACION,
  type Activacion,
  type TipoActivacion,
} from '@/features/booking/data/management-activaciones';

/**
 * Modal `Editar activación` — calco del live del 2026-09-09
 * (`docs/references/conceptone-v3-2026-09-09/f2-management--activaciones-detalle.main.html`,
 * y las 31 fichas campo a campo en `f2d-management--activaciones-modales.txt`).
 *
 * Siete campos. Dos diferencias con el modal de campañas que **no** son
 * descuido, están medidas: aquí **no hay botón `Eliminar`** —el aspa de borrar
 * vive en la fila, no dentro del modal— y la `Descripción` es un `textarea` de
 * ocho filas, mucho más alto que el de notas de campañas.
 *
 * El desplegable `Campaña` ofrece sólo las campañas del artista elegido, y
 * cuando ese artista no tiene ninguna el live añade debajo la pista «Este
 * artista no tiene campañas todavía.» — medida en la ficha de Milan Torne.
 *
 * Los `<select>` son nativos, como en el live; el de fecha es el `dp` de la
 * carcasa y por eso usa `ApxDp`.
 */
export interface EditarActivacionModalProps {
  activacion: Activacion;
  onGuardar: (activacion: Activacion) => void;
  onCancelar: () => void;
}

export function EditarActivacionModal({
  activacion,
  onGuardar,
  onCancelar,
}: EditarActivacionModalProps) {
  const [borrador, setBorrador] = useState<Activacion>(activacion);

  const cambiar = <C extends keyof Activacion>(campo: C, valor: Activacion[C]) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }));

  const campanasDelArtista = CAMPANAS.filter((c) => c.artista === borrador.artista);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Editar activación</h2>
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
            <label
              className="mb-1 block text-xs font-medium text-slate-500"
              htmlFor="activacion-titulo"
            >
              Título
            </label>
            <input
              id="activacion-titulo"
              className="input h-9 w-full"
              placeholder="p. ej. Deadline de prensa · single"
              value={borrador.titulo}
              onChange={(e) => cambiar('titulo', e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="activacion-artista"
              >
                Artista
              </label>
              <select
                id="activacion-artista"
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
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="activacion-tipo"
              >
                Tipo
              </label>
              <select
                id="activacion-tipo"
                className="input h-9 w-full"
                value={borrador.tipo}
                onChange={(e) => cambiar('tipo', e.target.value as TipoActivacion)}
              >
                {TIPOS_ACTIVACION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Fecha</label>
              <ApxDp valor={borrador.fecha} onCambio={(v) => cambiar('fecha', v ?? '')} />
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="activacion-hora"
              >
                Hora (opcional)
              </label>
              <input
                id="activacion-hora"
                className="input h-9 w-full"
                placeholder="--:--"
                maxLength={5}
                value={borrador.hora ?? ''}
                onChange={(e) => cambiar('hora', e.target.value || undefined)}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-500"
              htmlFor="activacion-campana"
            >
              Campaña{' '}
              <span className="font-normal text-slate-400">(de qué campaña forma parte)</span>
            </label>
            <select
              id="activacion-campana"
              className="input h-9 w-full disabled:bg-slate-50"
              value={borrador.campana ?? ''}
              onChange={(e) => cambiar('campana', e.target.value || undefined)}
            >
              <option value="">— Sin campaña —</option>
              {campanasDelArtista.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {campanasDelArtista.length === 0 && (
              <p className="mt-1 text-[11px] text-slate-400">
                Este artista no tiene campañas todavía.
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-500"
              htmlFor="activacion-descripcion"
            >
              Descripción
            </label>
            <textarea
              id="activacion-descripcion"
              rows={8}
              className="input min-h-[200px] w-full resize-y leading-relaxed"
              placeholder="Detalles de la activación: temas a tocar, enlaces, notas para el equipo…"
              value={borrador.nota ?? ''}
              onChange={(e) => cambiar('nota', e.target.value || undefined)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary text-sm" onClick={onCancelar}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary text-sm disabled:opacity-50"
              disabled={!borrador.titulo.trim()}
              onClick={() => onGuardar(borrador)}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
