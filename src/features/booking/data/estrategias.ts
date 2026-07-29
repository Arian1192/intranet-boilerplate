export interface ArtistaEstrategia {
  id: string;
  nombre: string;
}

function slug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Roster de management del live (barrido 29 jul 2026), en el mismo orden.
 * Es una lista propia: no coincide con el filtro «Artista» de Shows.
 */
export const ARTISTAS_ESTRATEGIA: string[] = [
  'Aaron Martin',
  'Abdon',
  'ACA',
  'ART NO LOGIA',
  'Bizza',
  'Claudia Tejeda',
  'DH Moon',
  'Fran Hernandez',
  'Freddy Bello',
  'Gaston Zani',
  'Janse',
  'Londonground',
  'Los Canarios',
  'Marcel BS',
  'MI',
  'Milan Rivellino',
  'Sebastian Ledher',
  'SO',
  'SOVA',
  'Test Artist',
  'Tony Guerra',
  'Vidaloca',
];

export const artistasEstrategia: ArtistaEstrategia[] = ARTISTAS_ESTRATEGIA.map((nombre) => ({
  id: slug(nombre),
  nombre,
}));

/** Los cuatro frentes que anuncia la bajada de la pantalla. */
export const FRENTES_ESTRATEGIA = ['Shows', 'Música', 'Patrocinios', 'Conexiones'] as const;

export const VACIO_ESTRATEGIA = 'Selecciona un artista para ver su estrategia.';
