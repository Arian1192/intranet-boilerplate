/**
 * Disponibilidad — datos mock-fieles (spec D1).
 * La lista de artistas libres y el conteo son seed (evidencia del textarea del live,
 * `dispo-message.json`, 39 nombres). Los chips de estilo y el cambio de fecha NO recalculan
 * la lista; solo el encabezado del mensaje reacciona a la fecha. Copiar sí funciona.
 */
export const ESTILOS = [
  'Tech House',
  'House',
  'Deep House',
  'Afro House',
  'Melodic House & Techno',
  'Techno',
  'Hard Techno',
  'Minimal / Deep Tech',
  'Progressive House',
  'Trance',
];

export const artistasLibres = [
  'Aaron Martin', 'Abdon', 'ACA', 'Andrea Castells', 'ART NO LOGIA', 'Bassel Darwish', 'Bizza',
  'Brenda Serna', 'Claudia Tejeda', 'DH Moon', 'Dhuna', 'Florentia', 'Fran Hernandez', 'Freddy Bello',
  'Gaston Zani', 'Janse', 'Jose Fajardo', 'Koleto', 'LA CINTIA', 'Londonground', 'Los Canarios',
  'Marcel BS', 'Marian Ariss', 'Milan', 'Nacho Scoppa', 'Olivia Bass', 'Parsa Jafari', 'Pau Guilera',
  'Prophecy', 'Rivellino', 'Rubenus', 'Saldivar', 'Sebastian Ledher', 'Sera De Villalta', 'Sergio Saffe',
  'SUMIA', 'Test Artist', 'Tomi & Kesh', 'Vidaloca',
];

export function mensajeDisponibilidad(fecha: Date): string {
  const larga = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  return `Disponibilidad para el ${larga}:\n\n` + artistasLibres.map((a) => `• ${a}`).join('\n');
}
