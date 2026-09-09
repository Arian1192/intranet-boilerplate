import { useMemo, useState } from 'react';
import { ApxDd } from '@/features/booking/components/ApxDd';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';
import {
  ACTIVACIONES,
  ESTADOS_ACTIVACION,
  HOY_CAPTURA,
  TIPOS_ACTIVACION,
  type Activacion,
  type EstadoActivacion,
} from '@/features/booking/data/management-activaciones';
import { EditarActivacionModal } from './EditarActivacionModal';

const DIA_SEMANA = new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' });
const MES_Y_ANIO = new Intl.DateTimeFormat('es-ES', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** El live escribe «1 activación» y, en plural, «activaciónes» con tilde. Es su literal. */
function contador(n: number) {
  return n === 1 ? '1 activación' : `${n} activaciónes`;
}

interface Fila extends Activacion {
  estado: EstadoActivacion;
}

/**
 * `/management/activaciones` — calco del live del 2026-09-09.
 *
 * Las 31 activaciones se agrupan por mes con el rótulo del live
 * (`septiembre de 2026`, que el `capitalize` del CSS sube a `Septiembre De
 * 2026`). Los dos desplegables y la casilla `Solo futuras` filtran de verdad, y
 * el contador de la derecha cuenta **lo filtrado**: medido en la pantalla
 * hermana de Campañas, donde pasa de «11 campañas» a «3 campañas» al elegir un
 * artista.
 *
 * `Solo futuras` compara contra el día de la captura, no contra hoy (ver
 * `HOY_CAPTURA`). Como el seed sólo trae las futuras de esa foto, desmarcarla no
 * añade filas: las pasadas del live no están capturadas.
 *
 * El `<select>` de estado y el aspa cambian el seed en local, igual que los
 * interruptores de `/management/roster`. En el live abren escritura real; aquí
 * no hay repositorio detrás.
 *
 * El título de cada fila es un `button` que abre el modal `Editar activación`,
 * igual que en el live. Ese modal **no** trae botón de borrar: el aspa de la
 * fila es la única forma de eliminar, y así está medido.
 */
export function ActivacionesPage() {
  const [filas, setFilas] = useState<Fila[]>(() =>
    ACTIVACIONES.map((a) => ({ ...a, estado: 'Programada' }))
  );
  const [artista, setArtista] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [soloFuturas, setSoloFuturas] = useState(true);
  const [editando, setEditando] = useState<Fila | null>(null);

  const visibles = useMemo(
    () =>
      filas.filter(
        (f) =>
          (!artista || f.artista === artista) &&
          (!tipo || f.tipo === tipo) &&
          (!soloFuturas || f.fecha >= HOY_CAPTURA)
      ),
    [filas, artista, tipo, soloFuturas]
  );

  /** Agrupa por mes conservando el orden de los datos, que ya es el del live. */
  const meses = useMemo(() => {
    const grupos: { mes: string; filas: Fila[] }[] = [];
    for (const fila of visibles) {
      const mes = MES_Y_ANIO.format(new Date(`${fila.fecha}T12:00:00Z`));
      const ultimo = grupos[grupos.length - 1];
      if (ultimo?.mes === mes) ultimo.filas.push(fila);
      else grupos.push({ mes, filas: [fila] });
    }
    return grupos;
  }, [visibles]);

  const cambiarEstado = (titulo: string, estado: EstadoActivacion) =>
    setFilas((previas) => previas.map((f) => (f.titulo === titulo ? { ...f, estado } : f)));

  const borrar = (titulo: string) =>
    setFilas((previas) => previas.filter((f) => f.titulo !== titulo));

  const guardar = (cambiada: Activacion) => {
    setFilas((previas) =>
      previas.map((f) => (f.titulo === editando?.titulo ? { ...cambiada, estado: f.estado } : f))
    );
    setEditando(null);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Activaciones</h1>
          <p className="text-sm text-slate-500">
            Calendario de activaciones del roster: prensa, releases, posts, rodajes, entregas…
          </p>
        </div>
        <button type="button" className="btn-primary text-sm">
          + Nueva activación
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ApxDd
          todas="Todos los artistas"
          opciones={ARTISTAS_MANAGEMENT}
          valor={artista}
          onCambio={setArtista}
          ancho="w-48"
        />
        <ApxDd
          todas="Todos los tipos"
          opciones={TIPOS_ACTIVACION}
          valor={tipo}
          onCambio={setTipo}
          ancho="w-52"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={soloFuturas}
            onChange={(e) => setSoloFuturas(e.target.checked)}
          />{' '}
          Solo futuras
        </label>
        <span className="ml-auto text-xs text-slate-400">{contador(visibles.length)}</span>
      </div>

      {visibles.length === 0 ? (
        <div className="card py-10 text-center text-sm text-slate-400">Sin activaciones.</div>
      ) : (
        <div className="space-y-5">
          {meses.map((grupo) => (
            <div key={grupo.mes}>
              <h2 className="mb-2 text-sm font-semibold capitalize text-slate-500">{grupo.mes}</h2>
              <div className="card divide-y divide-slate-100 p-0">
                {grupo.filas.map((fila) => (
                  <div
                    key={fila.titulo}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50"
                  >
                    <div className="w-12 shrink-0 text-center">
                      <div className="text-lg font-bold leading-none text-slate-800">
                        {Number(fila.fecha.slice(8, 10))}
                      </div>
                      <div className="text-[10px] uppercase text-slate-400">
                        {DIA_SEMANA.format(new Date(`${fila.fecha}T12:00:00Z`))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => setEditando(fila)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-800">
                          {fila.titulo}
                        </span>
                        <span className="badge bg-slate-100 text-[10px] text-slate-500">
                          {fila.tipo}
                        </span>
                      </div>
                      <div className="truncate text-xs text-slate-400">
                        {fila.nota ? `${fila.artista} · ${fila.nota}` : fila.artista}
                      </div>
                    </button>
                    <select
                      className="badge border-0 bg-slate-100 text-[11px] text-slate-600"
                      aria-label={`Estado de ${fila.titulo}`}
                      value={fila.estado}
                      onChange={(e) =>
                        cambiarEstado(fila.titulo, e.target.value as EstadoActivacion)
                      }
                    >
                      {ESTADOS_ACTIVACION.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="text-xs text-slate-300 hover:text-rose-600"
                      title="Eliminar"
                      onClick={() => borrar(fila.titulo)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <EditarActivacionModal
          activacion={editando}
          onGuardar={guardar}
          onCancelar={() => setEditando(null)}
        />
      )}
    </div>
  );
}
