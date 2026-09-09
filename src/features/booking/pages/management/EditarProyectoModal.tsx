import { useState } from 'react';
import { ApxDp } from '@/features/booking/components/ApxDp';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import { CAMPANAS } from '@/features/booking/data/management-campanas';
import {
  FASES_CONTENT,
  PAGA_PROYECTO,
  TIPOS_CONTENT,
  type FaseContent,
  type PagaProyecto,
  type ProyectoContent,
  type TipoContent,
} from '@/features/booking/data/management-content';

/**
 * Modal `Editar proyecto` — calco del live del 2026-09-09
 * (`docs/references/conceptone-v3-2026-09-09/f2-management--content-detalle.main.html`
 * y `f2d-management--content-modales.txt`).
 *
 * El más grande de los tres: dieciséis campos, con tres casillas sueltas
 * —`Proveedor externo`, `Recuperable` y `Aprobado`— que el live coloca fuera de
 * las rejillas, cada una en su propio `label`. La de `Recuperable` va **dentro**
 * de la rejilla de dos columnas, alineada abajo con `items-end` y `pb-1.5`, y no
 * es un descuido del calco: así está en el volcado.
 *
 * Los tres importes van en una rejilla de tres columnas, y `Brief enviado` y
 * `Entrega prevista` son `dp` vacíos, que el live rotula `dd/mm/aaaa` con la
 * clase `ph` en el `dp-lab`.
 *
 * Tampoco trae botón de borrar: en Content se elimina desde la propia tarjeta
 * del tablero.
 */
export interface EditarProyectoModalProps {
  proyecto: ProyectoContent;
  onGuardar: (proyecto: ProyectoContent) => void;
  onCancelar: () => void;
}

export function EditarProyectoModal({
  proyecto,
  onGuardar,
  onCancelar,
}: EditarProyectoModalProps) {
  const [borrador, setBorrador] = useState<ProyectoContent>(proyecto);

  const cambiar = <C extends keyof ProyectoContent>(campo: C, valor: ProyectoContent[C]) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }));

  const importe = (v: number | undefined) => (v === undefined ? '' : String(v));
  const aImporte = (s: string) => (s === '' ? undefined : Number(s));

  const campanasDelArtista = CAMPANAS.filter((c) => c.artista === borrador.artista);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Editar proyecto</h2>
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
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-titulo">
              Título
            </label>
            <input
              id="proyecto-titulo"
              className="input h-9 w-full"
              placeholder="p. ej. Videoclip single X"
              value={borrador.titulo}
              onChange={(e) => cambiar('titulo', e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-artista">
                Artista
              </label>
              <select
                id="proyecto-artista"
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
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-tipo">
                Tipo
              </label>
              <select
                id="proyecto-tipo"
                className="input h-9 w-full"
                value={borrador.tipo}
                onChange={(e) => cambiar('tipo', e.target.value as TipoContent)}
              >
                {TIPOS_CONTENT.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-fase">
                Fase
              </label>
              <select
                id="proyecto-fase"
                className="input h-9 w-full"
                value={borrador.fase}
                onChange={(e) => cambiar('fase', e.target.value as FaseContent)}
              >
                {FASES_CONTENT.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="proyecto-producido"
              >
                Producido por
              </label>
              <input
                id="proyecto-producido"
                className="input h-9 w-full"
                placeholder="ETRA, Euphoric, proveedor…"
                value={borrador.producidoPor ?? ''}
                onChange={(e) => cambiar('producidoPor', e.target.value || undefined)}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="proyecto-campana"
              >
                Campaña{' '}
                <span className="font-normal text-slate-400">(de qué campaña forma parte)</span>
              </label>
              <select
                id="proyecto-campana"
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
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={borrador.proveedorExterno ?? false}
              onChange={(e) => cambiar('proveedorExterno', e.target.checked)}
            />{' '}
            Proveedor externo
          </label>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-brief">
              Brief
            </label>
            <textarea
              id="proyecto-brief"
              className="input min-h-[70px] w-full"
              value={borrador.brief ?? ''}
              onChange={(e) => cambiar('brief', e.target.value || undefined)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="proyecto-cotizado"
              >
                Presup. cotizado (€)
              </label>
              <input
                id="proyecto-cotizado"
                type="number"
                className="input h-9 w-full"
                value={importe(borrador.presupuestoCotizado)}
                onChange={(e) => cambiar('presupuestoCotizado', aImporte(e.target.value))}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-xs font-medium text-slate-500"
                htmlFor="proyecto-aprobado-importe"
              >
                Aprobado (€)
              </label>
              <input
                id="proyecto-aprobado-importe"
                type="number"
                className="input h-9 w-full"
                value={importe(borrador.aprobadoImporte)}
                onChange={(e) => cambiar('aprobadoImporte', aImporte(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-real">
                Real (€)
              </label>
              <input
                id="proyecto-real"
                type="number"
                className="input h-9 w-full"
                value={importe(borrador.real)}
                onChange={(e) => cambiar('real', aImporte(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-paga">
                Paga
              </label>
              <select
                id="proyecto-paga"
                className="input h-9 w-full"
                value={borrador.paga ?? 'Artista'}
                onChange={(e) => cambiar('paga', e.target.value as PagaProyecto)}
              >
                {PAGA_PROYECTO.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* El live mete esta casilla dentro de la rejilla, alineada abajo. */}
            <label className="flex items-end gap-2 pb-1.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={borrador.recuperable ?? false}
                onChange={(e) => cambiar('recuperable', e.target.checked)}
              />{' '}
              Recuperable
            </label>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Brief enviado</label>
              <ApxDp
                valor={borrador.briefEnviado ?? null}
                onCambio={(v) => cambiar('briefEnviado', v ?? undefined)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Entrega prevista
              </label>
              <ApxDp
                valor={borrador.entregaPrevista ?? null}
                onCambio={(v) => cambiar('entregaPrevista', v ?? undefined)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={borrador.aprobado ?? false}
              onChange={(e) => cambiar('aprobado', e.target.checked)}
            />{' '}
            Aprobado
          </label>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="proyecto-notas">
              Notas
            </label>
            <textarea
              id="proyecto-notas"
              className="input min-h-[50px] w-full"
              value={borrador.notas ?? ''}
              onChange={(e) => cambiar('notas', e.target.value || undefined)}
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
