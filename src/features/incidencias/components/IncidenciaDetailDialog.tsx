import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { IncidenciaAvatar } from './IncidenciaAvatar';
import { INCIDENCIA_ESTADOS } from '../data/incidencias';
import type { Incidencia, IncidenciaEstado } from '../data/incidencias';

const ESTADO_BADGE: Record<IncidenciaEstado, string> = {
  nueva: 'bg-rose-100 text-rose-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-transparent text-slate-300',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

const ESTADO_LABEL: Record<IncidenciaEstado, string> = INCIDENCIA_ESTADOS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e.label }),
  {} as Record<IncidenciaEstado, string>
);

const COPIAR_TITLE = 'Copia la incidencia con su contexto y las instrucciones, lista para pegar en Claude';

/**
 * El live serializa el contexto con las claves tal cual las escribe el widget de Ayuda
 * (`errores_consola` en snake_case); el modelo las expone en camelCase, así que se
 * reconstruye el objeto en el orden y con los nombres del live antes de imprimirlo.
 */
function contextoComoJson(incidencia: Incidencia): string {
  const c = incidencia.contexto;
  if (!c) return '';
  return JSON.stringify(
    {
      url: c.url,
      ruta: c.ruta,
      zoom: c.zoom,
      cuando: c.cuando,
      idioma: c.idioma,
      ventana: c.ventana,
      pantalla: c.pantalla,
      navegador: c.navegador,
      conversacion: c.conversacion,
      errores_consola: c.erroresConsola,
    },
    null,
    2
  );
}

export interface IncidenciaDetailDialogProps {
  incidencia: Incidencia;
  onClose: () => void;
}

export function IncidenciaDetailDialog({ incidencia, onClose }: IncidenciaDetailDialogProps) {
  const [respuesta, setRespuesta] = useState(incidencia.respuesta ?? '');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copiarParaClaude = () => {
    const partes = [incidencia.texto];
    const json = contextoComoJson(incidencia);
    if (json) partes.push(json);
    void navigator.clipboard?.writeText(partes.join('\n\n'));
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de la incidencia"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-[min(46rem,100%)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ESTADO_BADGE[incidencia.estado]}`}
            >
              {ESTADO_LABEL[incidencia.estado]}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <IncidenciaAvatar
                size={16}
                reporterName={incidencia.reporterName}
                reporterInitials={incidencia.reporterInitials}
                reporterColor={incidencia.reporterColor}
                reporterAvatarUrl={incidencia.reporterAvatarUrl}
              />
              {incidencia.reporterName}
            </span>
            <span className="text-xs text-slate-400">· —</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title={COPIAR_TITLE}
              onClick={copiarParaClaude}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Copiar para Claude
            </button>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{incidencia.texto}</p>

          {incidencia.attachmentUrl && (
            <img
              src={incidencia.attachmentUrl}
              alt="Captura"
              className="w-full rounded-lg border border-slate-200"
            />
          )}

          {incidencia.contexto && (
            <details className="rounded-lg border border-slate-200 bg-slate-50">
              <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-slate-500">
                Contexto técnico
              </summary>
              <pre
                data-testid="contexto-tecnico"
                className="overflow-x-auto px-3 pb-3 text-[11px] leading-relaxed text-slate-500"
              >
                {contextoComoJson(incidencia)}
              </pre>
            </details>
          )}

          {incidencia.triaje && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Hipótesis del triaje
                <span className="ml-1.5 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                  {incidencia.triaje.categoria}
                </span>
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{incidencia.triaje.hipotesis}</p>
              <p className="mt-2 text-[11px] text-slate-400">{incidencia.triaje.nota}</p>
            </div>
          )}

          <div>
            <label className="label" htmlFor="incidencia-respuesta">
              Respuesta
            </label>
            <textarea
              id="incidencia-respuesta"
              className="input min-h-[70px] text-sm"
              placeholder="Qué era, qué has hecho. Se le manda al que lo reportó."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </div>
        </div>

        {/*
          Descartar / En curso / Resuelta se renderizan fieles pero INERTES: en el live
          cambian el estado en el backend y no se pulsaron (regla de no crear/editar/borrar
          en el live), así que no sabemos qué hacen después. Se deja documentado en vez de
          inventar el comportamiento.
        */}
        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
          <Button variant="ghost" size="sm">
            Descartar
          </Button>
          <Button variant="secondary" size="sm">
            En curso
          </Button>
          <Button variant="primary" size="sm" className="bg-slate-900 hover:bg-slate-800">
            Resuelta
          </Button>
        </div>
      </div>
    </div>
  );
}
