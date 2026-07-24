/**
 * Filtro de rango temporal de Shows.
 * HOY se fija a 2026-07-24 (spec D4): el live usa el reloj real, pero fijarlo
 * mantiene el calco determinista y testeable.
 */
export const HOY = '2026-07-24';

export type DesdeValue = 'ultima-semana' | 'ultimos-3-dias' | 'ultimo-mes' | 'ultimo-ano' | 'todo-pasado';
export type HastaValue =
  | 'todo-futuro'
  | 'proximos-3-dias'
  | 'proxima-semana'
  | 'proximo-mes'
  | 'proximo-ano'
  | 'hasta-hoy';

export interface Rango {
  desde: DesdeValue;
  hasta: HastaValue;
}

export const desdeOpciones: { value: DesdeValue; label: string }[] = [
  { value: 'ultima-semana', label: 'Última semana' },
  { value: 'ultimos-3-dias', label: 'Últimos 3 días' },
  { value: 'ultimo-mes', label: 'Último mes' },
  { value: 'ultimo-ano', label: 'Último año' },
  { value: 'todo-pasado', label: 'Todo el pasado' },
];

export const hastaOpciones: { value: HastaValue; label: string }[] = [
  { value: 'todo-futuro', label: 'Todo el futuro' },
  { value: 'proximos-3-dias', label: 'Próximos 3 días' },
  { value: 'proxima-semana', label: 'Próxima semana' },
  { value: 'proximo-mes', label: 'Próximo mes' },
  { value: 'proximo-ano', label: 'Próximo año' },
  { value: 'hasta-hoy', label: 'Hasta hoy' },
];

export const rangoPorDefecto: Rango = { desde: 'ultima-semana', hasta: 'todo-futuro' };

export function desdeLabel(value: DesdeValue): string {
  return desdeOpciones.find((o) => o.value === value)!.label;
}
export function hastaLabel(value: HastaValue): string {
  return hastaOpciones.find((o) => o.value === value)!.label;
}

const MESES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, sept: 8, oct: 9, nov: 10, dic: 11,
};

/** Parsea "DD mmm YYYY" (es-ES, p.ej. "04 sept 2026") a Date a medianoche. `null` si no parsea. */
export function parseShowDate(dateStr: string): Date | null {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const [ddRaw, monRaw, yyyyRaw] = parts;
  const day = Number(ddRaw);
  const month = MESES[monRaw.toLowerCase().replace('.', '')];
  const year = Number(yyyyRaw);
  if (!Number.isFinite(day) || month === undefined || !Number.isFinite(year)) return null;
  return new Date(year, month, day);
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}
function addYears(base: Date, years: number): Date {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function limiteInferior(desde: DesdeValue, hoy: Date): Date | null {
  switch (desde) {
    case 'todo-pasado': return null;
    case 'ultima-semana': return addDays(hoy, -7);
    case 'ultimos-3-dias': return addDays(hoy, -3);
    case 'ultimo-mes': return addMonths(hoy, -1);
    case 'ultimo-ano': return addYears(hoy, -1);
  }
}

function limiteSuperior(hasta: HastaValue, hoy: Date): Date | null {
  switch (hasta) {
    case 'todo-futuro': return null;
    case 'hasta-hoy': return hoy;
    case 'proximos-3-dias': return addDays(hoy, 3);
    case 'proxima-semana': return addDays(hoy, 7);
    case 'proximo-mes': return addMonths(hoy, 1);
    case 'proximo-ano': return addYears(hoy, 1);
  }
}

/** Un show con `date` null siempre pasa (no se filtra por rango). */
export function dentroDeRango(dateStr: string | null, rango: Rango, hoy: string = HOY): boolean {
  if (dateStr === null) return true;
  const fecha = parseShowDate(dateStr);
  if (fecha === null) return true;
  // `hoy` en ISO "YYYY-MM-DD" → Date a medianoche local
  const [y, m, d] = hoy.split('-').map(Number);
  const hoyMid = new Date(y, m - 1, d);
  const inf = limiteInferior(rango.desde, hoyMid);
  const sup = limiteSuperior(rango.hasta, hoyMid);
  if (inf && fecha < inf) return false;
  if (sup && fecha > sup) return false;
  return true;
}
