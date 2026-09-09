import { Link, useParams } from 'react-router';
import { useShows } from '../hooks/useShows';

/**
 * Stub del detalle de show (`/shows/:showId`).
 *
 * **Por qué existe.** La ruta no estaba registrada y nuestro router **no tiene
 * catch-all**, así que esa URL no pintaba nada: pantalla en blanco. Y ya había
 * un enlace vivo apuntando ahí desde `main` — el «Ver show» de cada fila del
 * itinerario en `TourDetallePage` (Fase A). Registrar la ruta lo arregla de
 * rebote, y es lo que permite que las filas de `/shows` naveguen como en el
 * live.
 *
 * Medido en el live el 2026-09-09 a las 13:07 CEST
 * (`docs/references/conceptone-v3-2026-09-09/f2f-shows-detalle.{txt,png}`):
 * pulsar una fila navega a `/shows/<uuid>`, el `h1` del detalle es **el nombre
 * del propio show** —«Milan Torne @ House of Ferns»— y el enlace de vuelta dice
 * **«← Volver a la lista»**. De ahí salen la cabecera y el enlace de este stub;
 * no están inventados.
 *
 * **El cuerpo lo escribe otra fase**, no ésta: el live trae ahí un paginador
 * («Shows filtrados 1/87»), la ficha del show, el conmutador de estado con sus
 * seis segmentos, tareas, incidencias y el bloque de dinero. Es una pantalla
 * entera. Aquí sólo se registra la ruta, con el mismo patrón que usó la Fase 0
 * con sus 14 rutas y la Faena 1 con `/tours/:tourId`.
 *
 * Las 243 filas de `/liquidaciones` siguen inertes por lo mismo y se
 * desbloquean solas el día que exista el cuerpo: su comentario ya dice «hasta
 * que exista esa pantalla».
 */
export function ShowDetallePage() {
  const { showId } = useParams();
  const { shows } = useShows();
  const show = shows.find((s) => s.id === showId);

  return (
    <div>
      <div className="mb-4">
        <Link to="/shows" className="text-sm text-slate-500 hover:text-slate-700">
          ← Volver a la lista
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-slate-800">
        {show ? `${show.artist} @ ${show.event}` : 'Detalle del show'}
      </h1>
      {show && <p className="mt-1 text-sm text-slate-500">{show.code}</p>}
    </div>
  );
}
