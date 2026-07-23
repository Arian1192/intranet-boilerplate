import { CollapsibleSection } from './CollapsibleSection';
import { entradasObjetivo } from '../data/calculos-escenarios';
import type { EventoAforo, Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

const FECHA_CORTA = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

function formatFechaCorta(iso: string): string {
  if (!iso) return 'sin fecha';
  return FECHA_CORTA.format(new Date(`${iso}T00:00:00`)).replace('.', '');
}

export function EventoAforoCard({ proyeccion, onUpdate }: Props) {
  const { eventoAforo, ticketing, ajustesEscenarios } = proyeccion;
  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  const setEvento = (patch: Partial<EventoAforo>) => {
    onUpdate({ eventoAforo: { ...eventoAforo, ...patch } });
  };

  // La nota de asistencia siempre se muestra en Base (mismo criterio que Acuerdo — sin
  // selector de escenario propio en esta tarjeta).
  const entradasBase = entradasObjetivo(
    ticketing, ajustesEscenarios, 'base', eventoAforo.invitaciones, eventoAforo.asistenciaForzada
  );
  const asistenciaProyectada = entradasBase + eventoAforo.invitaciones;

  return (
    <CollapsibleSection
      title="Evento y aforo"
      summary={`${formatFechaCorta(eventoAforo.fecha)} · ${eventoAforo.aforoMaximo} · ${eventoAforo.duracionHoras}h · ${asistenciaProyectada} pax`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Nombre</span>
            <input
              type="text"
              aria-label="NOMBRE"
              value={eventoAforo.nombre}
              onChange={(e) => setEvento({ nombre: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Fecha</span>
            <input
              type="date"
              aria-label="FECHA"
              value={eventoAforo.fecha}
              onChange={(e) => setEvento({ fecha: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Venue</span>
            <input
              type="text"
              aria-label="VENUE"
              value={eventoAforo.venue}
              onChange={(e) => setEvento({ venue: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Aforo máximo</span>
            <input
              type="number"
              aria-label="AFORO MÁXIMO"
              value={eventoAforo.aforoMaximo}
              onChange={(e) => setEvento({ aforoMaximo: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Duración (horas)</span>
            <input
              type="number"
              aria-label="DURACIÓN (HORAS)"
              value={eventoAforo.duracionHoras}
              onChange={(e) => setEvento({ duracionHoras: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">Invitaciones</span>
            <input
              type="number"
              aria-label="INVITACIONES"
              value={eventoAforo.invitaciones}
              onChange={(e) => setEvento({ invitaciones: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">IVA ticketing %</span>
            <input
              type="number"
              aria-label="IVA TICKETING %"
              value={eventoAforo.ivaTicketingPct}
              onChange={(e) => setEvento({ ivaTicketingPct: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase text-slate-400">IVA barras/comida/VIP %</span>
            <input
              type="number"
              aria-label="IVA BARRAS/COMIDA/VIP %"
              value={eventoAforo.ivaBarrasComidaVipPct}
              onChange={(e) => setEvento({ ivaBarrasComidaVipPct: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            aria-label="Forzar a mano"
            checked={eventoAforo.asistenciaForzada !== undefined}
            onChange={(e) =>
              setEvento({ asistenciaForzada: e.target.checked ? asistenciaProyectada : undefined })
            }
          />
          Forzar a mano
        </label>
        {eventoAforo.asistenciaForzada !== undefined && (
          <label className="block text-xs">
            <span className="mb-1 block uppercase text-slate-400">Asistencia forzada</span>
            <input
              type="number"
              aria-label="Asistencia forzada"
              value={eventoAforo.asistenciaForzada}
              onChange={(e) => setEvento({ asistenciaForzada: Number(e.target.value) })}
              className={inputClass}
            />
          </label>
        )}

        <p className="text-sm text-slate-500">
          Asistencia proyectada {asistenciaProyectada} = entradas + invitaciones · PAX de pago {entradasBase}
        </p>
      </div>
    </CollapsibleSection>
  );
}
