/**
 * Saludo de cabecera de Mi trabajo, dependiente de la hora, como en el live.
 * Corte de «días» a las 14:00: el barrido del live devolvía «Buenos días» a las 13:14.
 */
export function saludo(nombre: string, ahora: Date = new Date()): string {
  const hora = ahora.getHours();
  const franja = hora >= 21 || hora < 6 ? 'Buenas noches' : hora < 14 ? 'Buenos días' : 'Buenas tardes';
  const pila = nombre.trim().split(/\s+/)[0] ?? '';
  return pila ? `${franja}, ${pila}` : franja;
}
