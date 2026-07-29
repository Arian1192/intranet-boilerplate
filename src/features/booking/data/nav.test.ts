import { describe, it, expect } from 'vitest';
import {
  CONCEPTONE_AREAS,
  BOOKINGS_SECTIONS,
  activeArea,
  activeSection,
  showsSectionBar,
} from './nav';

describe('nav de ConceptOne v2', () => {
  it('el nivel 1 son las 4 áreas del live, en orden y con sus hrefs', () => {
    expect(CONCEPTONE_AREAS).toEqual([
      { label: 'Bookings', href: '/conceptone' },
      { label: 'Management', href: '/management/estrategias' },
      { label: 'Calendario', href: '/calendario-c1' },
      { label: 'Contactos', href: '/contactos' },
    ]);
  });

  it('el nivel 2 son las 6 secciones de Bookings, en orden y con sus hrefs', () => {
    expect(BOOKINGS_SECTIONS).toEqual([
      { label: 'Dashboard', href: '/conceptone' },
      { label: 'Shows', href: '/shows' },
      { label: 'Ofertas', href: '/ofertas' },
      { label: 'Cobros', href: '/cobros' },
      { label: 'Gastos', href: '/gastos' },
      { label: 'Disponibilidad', href: '/disponibilidad' },
    ]);
  });

  it.each([
    ['/conceptone', 'Bookings'],
    ['/shows', 'Bookings'],
    ['/ofertas', 'Bookings'],
    ['/cobros', 'Bookings'],
    ['/gastos', 'Bookings'],
    ['/disponibilidad', 'Bookings'],
    ['/management/estrategias', 'Management'],
    ['/calendario-c1', 'Calendario'],
    ['/contactos', 'Contactos'],
  ])('%s activa el área %s', (path, area) => {
    expect(activeArea(path)).toBe(area);
  });

  it('una ruta ajena no activa ningún área', () => {
    expect(activeArea('/crm')).toBeNull();
    expect(activeArea('/managementos')).toBeNull();
  });

  it('la sección activa sale de la ruta y es null fuera de Bookings', () => {
    expect(activeSection('/cobros')).toBe('Cobros');
    expect(activeSection('/conceptone')).toBe('Dashboard');
    expect(activeSection('/management/estrategias')).toBeNull();
    expect(activeSection('/contactos')).toBeNull();
  });

  it('la barra de secciones sólo se muestra dentro de Bookings', () => {
    expect(showsSectionBar('/gastos')).toBe(true);
    expect(showsSectionBar('/management/estrategias')).toBe(false);
    expect(showsSectionBar('/calendario-c1')).toBe(false);
    expect(showsSectionBar('/contactos')).toBe(false);
  });
});
