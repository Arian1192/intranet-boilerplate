import { describe, it, expect } from 'vitest';
import { RAIL_GROUPS, RAIL_FOOT, esItemActivo } from './nav';

describe('nav del rail — los tres grupos', () => {
  it('son Bookings, Management y Más, en ese orden', () => {
    expect(RAIL_GROUPS.map((g) => g.caption)).toEqual(['Bookings', 'Management', 'Más']);
  });

  it('Bookings trae los 10 ítems del live con sus rutas', () => {
    expect(RAIL_GROUPS[0].items.map((i) => [i.label, i.href])).toEqual([
      ['Dashboard', '/conceptone'],
      ['Shows', '/shows'],
      ['Tours', '/tours'],
      ['Ofertas', '/ofertas'],
      ['Cobros', '/cobros'],
      ['Gastos', '/gastos'],
      ['Liquidaciones', '/liquidaciones'],
      ['Disponibilidad', '/disponibilidad'],
      ['Calendario', '/calendario-c1'],
      ['Contactos', '/contactos'],
    ]);
  });

  it('Management trae los 8 ítems del live con sus rutas', () => {
    expect(RAIL_GROUPS[1].items.map((i) => [i.label, i.href])).toEqual([
      ['Roster', '/management/roster'],
      ['Insights', '/management/insights'],
      ['Estrategias', '/management/estrategias'],
      ['Contratos', '/management/contratos'],
      ['Activaciones', '/management/activaciones'],
      ['Campañas', '/management/campanas'],
      ['Content', '/management/content'],
      ['Incidencias', '/management/incidentes'],
    ]);
  });

  it('Más trae los 3 ítems del live con sus rutas', () => {
    expect(RAIL_GROUPS[2].items.map((i) => [i.label, i.href])).toEqual([
      ['Roster', '/artistas'],
      ['Análisis', '/reporte'],
      ['Ajustes', '/conceptone/ajustes'],
    ]);
  });

  it('mantiene los dos ítems rotulados «Roster» apuntando a rutas distintas', () => {
    const rosters = RAIL_GROUPS.flatMap((g) => g.items).filter((i) => i.label === 'Roster');
    expect(rosters.map((i) => i.href)).toEqual(['/management/roster', '/artistas']);
  });

  it('da 21 ítems de navegación en total', () => {
    expect(RAIL_GROUPS.flatMap((g) => g.items)).toHaveLength(21);
  });
});

describe('nav del rail — el pie', () => {
  it('son seis elementos en el orden del live', () => {
    expect(RAIL_FOOT.map((i) => (i.kind === 'perfil' ? 'Perfil' : i.label))).toEqual([
      'Black Moose',
      'Pendientes',
      'Modo noche',
      'Ayuda',
      'Notificaciones',
      'Perfil',
    ]);
  });

  it('distingue enlaces, botones, campana y perfil', () => {
    expect(RAIL_FOOT.map((i) => i.kind)).toEqual([
      'link',
      'link',
      'action',
      'action',
      'notificaciones',
      'perfil',
    ]);
  });
});

describe('esItemActivo', () => {
  it('marca el ítem cuya ruta coincide', () => {
    expect(esItemActivo('/cobros', '/cobros')).toBe(true);
    expect(esItemActivo('/cobros', '/gastos')).toBe(false);
  });

  it('mantiene encendida Incidencias en su subruta de analítica', () => {
    expect(esItemActivo('/management/incidentes/analitica', '/management/incidentes')).toBe(true);
  });

  it('trata /conceptone como exacto, para no pisar a Pendientes ni a Ajustes', () => {
    expect(esItemActivo('/conceptone', '/conceptone')).toBe(true);
    expect(esItemActivo('/conceptone/pendientes', '/conceptone')).toBe(false);
    expect(esItemActivo('/conceptone/ajustes', '/conceptone')).toBe(false);
    expect(esItemActivo('/conceptone/ajustes', '/conceptone/ajustes')).toBe(true);
  });

  it('no confunde prefijos parciales', () => {
    expect(esItemActivo('/management/rosterazo', '/management/roster')).toBe(false);
    expect(esItemActivo('/', '/')).toBe(true);
    expect(esItemActivo('/shows', '/')).toBe(false);
  });
});
