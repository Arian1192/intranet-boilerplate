import type { CalendarEvent } from '@/types';

/**
 * Seed propio del Calendario (spec D1): independiente del dataset de `Show` de Fase B.
 * Incluye ciudad (campo que `Show` no tiene) y shows que el rango de la lista oculta
 * (Bizza 15-jul, Los Canarios @ Mamarela 2-ago). Datos = evidencia del live (spec D4);
 * grafías literales del live conservadas (venue "Marmarela" / evento "Mamarela").
 */
export const calendarEvents: CalendarEvent[] = [
  // Julio 2026
  { id: 'ce-01', date: '2026-07-15', type: 'show', artist: 'Bizza', venue: 'Hï', city: 'Illes Balears', event: 'Paradise - Bunker', paymentStatus: 'No abonado' },
  { id: 'ce-02', date: '2026-07-18', type: 'show', artist: 'Los Canarios', venue: 'Edén Ibiza', city: 'Sant Antoni de Portmany', event: 'FUEGO', paymentStatus: 'No abonado' },
  { id: 'ce-03', date: '2026-07-18', type: 'show', artist: 'Abdon', venue: 'Bassment', city: 'Madrid', event: 'FUNDAYS', paymentStatus: 'No abonado' },
  { id: 'ce-04', date: '2026-07-21', type: 'show', artist: 'Test Artist', venue: 'Ku Barcelona', city: 'Barcelona', event: 'SIGHT', paymentStatus: 'No abonado' },
  { id: 'ce-05', date: '2026-07-23', type: 'hold', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed' },
  { id: 'ce-06', date: '2026-07-25', type: 'show', artist: 'Florentia', venue: 'Paseo de Santiago, Torreperogil', city: 'Torreperogil', event: 'Summer Opening Festival', paymentStatus: 'Liquidado' },
  { id: 'ce-07', date: '2026-07-26', type: 'show', artist: 'Abdon', venue: 'Ku Barcelona', city: 'Barcelona', event: 'SIGHT', paymentStatus: 'No abonado' },
  { id: 'ce-08', date: '2026-07-26', type: 'show', artist: 'Pau Guilera', venue: 'Marina Beach Club', city: 'Valencia', event: 'the next', paymentStatus: 'No abonado' },
  // Agosto 2026
  { id: 'ce-09', date: '2026-08-01', type: 'show', artist: 'Milan', venue: 'Casa del Mar', city: 'Isla Santa Catalina', event: 'Casa del Mar', paymentStatus: 'No abonado' },
  { id: 'ce-10', date: '2026-08-01', type: 'show', artist: 'Los Canarios', venue: 'Hangar 37', city: 'San Bartolomé de Tirajana', event: 'Solart Fest', paymentStatus: 'No abonado' },
  { id: 'ce-11', date: '2026-08-02', type: 'show', artist: 'Los Canarios', venue: 'Marmarela', city: 'Alicante', event: 'Mamarela', paymentStatus: 'No abonado' },
  // Septiembre 2026
  { id: 'ce-12', date: '2026-09-04', type: 'show', artist: 'Brenda Serna', venue: null, city: null, event: 'Alcazar de San Juan', paymentStatus: 'Parcialmente abonado' },
  { id: 'ce-13', date: '2026-09-18', type: 'show', artist: 'Sergio Saffe', venue: 'el Tebo', city: 'Valparaiso', event: 'el Tebo', paymentStatus: 'No abonado' },
  { id: 'ce-14', date: '2026-09-25', type: 'show', artist: 'Marian Ariss', venue: 'La Fábrica', city: 'Cordoba', event: 'Kevin de Vries Cordoba', paymentStatus: 'No abonado' },
  { id: 'ce-15', date: '2026-09-26', type: 'show', artist: 'ART NO LOGIA', venue: 'Boho Beer Garden', city: 'Birmingham', event: 'Jiwa', paymentStatus: 'No abonado' },
  { id: 'ce-16', date: '2026-09-26', type: 'show', artist: 'Marian Ariss', venue: 'Mandarine Park', city: 'Buenos Aires', event: 'Kevin de Vries Buenos Aires', paymentStatus: 'No abonado' },
];

/** month 0-indexed (enero=0). */
export function eventsForMonth(year: number, month: number): CalendarEvent[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return calendarEvents.filter((e) => e.date.startsWith(prefix));
}

export function eventsForDay(dateISO: string): CalendarEvent[] {
  return calendarEvents.filter((e) => e.date === dateISO);
}
