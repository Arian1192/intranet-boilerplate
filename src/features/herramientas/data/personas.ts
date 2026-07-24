import type { Responsable } from './types';

/**
 * Pool de personas seleccionables en el picker de responsables. Lista EXACTA capturada
 * del desplegable "＋ Añadir" del live (solo lectura), mismos nombres y orden —
 * ver `docs/references/herramientas/live-picker-responsables-full.png` (spec Fase C, D4).
 * Jack Howell y Tony Carrerira comparten id con la semilla (`resp-jack`/`resp-tony`) para
 * que el picker los marque como asignados en "PQ @ SLS Barcelona".
 */
export const personasDisponibles: Responsable[] = [
  { id: 'resp-alba-gelabert', nombre: 'Alba Gelabert', iniciales: 'AG' },
  { id: 'resp-alberto-egea', nombre: 'Alberto Egea', iniciales: 'AE' },
  { id: 'resp-aldo-messina', nombre: 'Aldo Messina', iniciales: 'AM' },
  { id: 'resp-alex-gonzalez', nombre: 'Alex González', iniciales: 'AG' },
  { id: 'resp-carlos-pego', nombre: 'Carlos Pego', iniciales: 'CP' },
  { id: 'resp-fran-hinojosa', nombre: 'Fran Hinojosa Veredas', iniciales: 'FV' },
  { id: 'resp-israel-cuenca', nombre: 'Israel Cuenca', iniciales: 'IC' },
  { id: 'resp-jack', nombre: 'Jack Howell', iniciales: 'JH' },
  { id: 'resp-jassi-gonzalez', nombre: 'Jassi Gonzalez Montes', iniciales: 'JM' },
  { id: 'resp-joe-coe', nombre: 'Joe Coe', iniciales: 'JC' },
  { id: 'resp-juan-staff', nombre: 'Juan (Staff Level Test)', iniciales: 'JT' },
  { id: 'resp-oscar-buch', nombre: 'Oscar Buch', iniciales: 'OB' },
  { id: 'resp-patricia-pareja', nombre: 'Patricia Pareja Casalí', iniciales: 'PC' },
  { id: 'resp-sadkiel', nombre: 'Sadkiel', iniciales: 'S' },
  { id: 'resp-test', nombre: 'test', iniciales: 'T' },
  { id: 'resp-tony', nombre: 'Tony Carrerira', iniciales: 'TC' },
  { id: 'resp-yenifer-bernardo', nombre: 'Yenifer Bernardo', iniciales: 'YB' },
];

export function buscarPersonas(query: string): Responsable[] {
  const q = query.trim().toLowerCase();
  if (q === '') return personasDisponibles;
  return personasDisponibles.filter((p) => p.nombre.toLowerCase().includes(q));
}
