/**
 * Pestaña «Eventos / Promotoras» de `/contactos`.
 *
 * Calcada de `f1e-contactos--eventos-promotoras` (live del 2026-09-09, 12:2x
 * CEST). Esta pestaña **no existía** en nuestra pantalla: se construye.
 *
 * Ojo al nombre: la pestaña dice «Eventos / Promotoras», pero las 23 fichas de
 * hoy son **todas de tipo `Evento`**. Ni una promotora. El tipo va en el dato
 * en vez de darse por hecho, para que el día que aparezca una promotora se vea
 * en la lista y no haya que rehacer nada.
 */

export interface EventoContacto {
  nombre: string;
  /** El badge índigo de la izquierda. */
  tipo: string;
}

export const BADGE_EVENTO = 'bg-indigo-100 text-indigo-700';

export const PLACEHOLDER_EVENTOS = 'Buscar evento o promotora…';

export const eventosPromotoras: EventoContacto[] = [
  { nombre: 'After Brunch', tipo: 'Evento' },
  { nombre: 'Ayahuasca Marbella', tipo: 'Evento' },
  { nombre: 'Boiler', tipo: 'Evento' },
  { nombre: 'Cecille Showcase', tipo: 'Evento' },
  { nombre: 'DEXT GONNA GEOOVE', tipo: 'Evento' },
  { nombre: 'HIDA OPEN AIR', tipo: 'Evento' },
  { nombre: 'ILLUISION', tipo: 'Evento' },
  { nombre: 'Infinity Segundo Aniversario', tipo: 'Evento' },
  { nombre: 'Kompaz Crew', tipo: 'Evento' },
  { nombre: 'Lost City', tipo: 'Evento' },
  { nombre: 'Magnetic People', tipo: 'Evento' },
  { nombre: 'Marina Beach', tipo: 'Evento' },
  { nombre: 'Morenos', tipo: 'Evento' },
  { nombre: 'Raw', tipo: 'Evento' },
  { nombre: 'Resaca Club', tipo: 'Evento' },
  { nombre: 'Roma Eventos', tipo: 'Evento' },
  { nombre: 'Savana', tipo: 'Evento' },
  { nombre: 'Selva Mallorca', tipo: 'Evento' },
  { nombre: 'The Garden', tipo: 'Evento' },
  { nombre: 'Treze Events', tipo: 'Evento' },
  { nombre: 'True Torero', tipo: 'Evento' },
  { nombre: 'WonderMusic 2026', tipo: 'Evento' },
  { nombre: 'Zona Groove', tipo: 'Evento' },
];

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filtrarEventos(lista: EventoContacto[], texto: string): EventoContacto[] {
  if (!texto.trim()) return lista;
  const aguja = normalizar(texto);
  return lista.filter((e) => normalizar(e.nombre).includes(aguja));
}
