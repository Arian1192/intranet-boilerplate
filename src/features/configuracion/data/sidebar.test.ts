import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { sidebarSections } from './sidebar';

describe('sidebar data', () => {
  it('6 secciones en el orden del live', () => {
    const sections = sidebarSections();
    expect(sections.map((s) => s.label)).toEqual([
      'SISTEMA',
      'MI TRABAJO',
      'COMUNICACIÓN',
      'CONCEPTONE · BOOKING',
      'PRODUCCIÓN',
      'EQUIPO',
    ]);
  });

  it('12 ítems en total, en el orden del live', () => {
    const sections = sidebarSections();
    const items = sections.flatMap((s) => s.items.map((i) => i.label));
    expect(items).toEqual([
      'Uso y coste',
      'Incidencias',
      'Cuentas (auditoría)',
      'Documentos (tipografía)',
      'Plantillas de correo',
      'Notificaciones',
      'Comisiones de bookers',
      'Control de comisiones',
      'Contratos',
      'Alertas de eventos',
      'RRHH (coste y avisos)',
      'Festivos',
    ]);
  });

  it('Cuentas (auditoría) es un link de salida a /personal', () => {
    const sections = sidebarSections();
    const item = sections.flatMap((s) => s.items).find((i) => i.label === 'Cuentas (auditoría)')!;
    expect(item.href).toBe('/personal');
    expect(item.external).toBe(true);
  });

  it('Plantillas de correo apunta al índice del módulo (landing)', () => {
    const sections = sidebarSections();
    const item = sections.flatMap((s) => s.items).find((i) => i.label === 'Plantillas de correo')!;
    expect(item.href).toBe('/configuracion');
    expect(item.external).toBeUndefined();
  });

  it('es inmutable entre llamadas', () => {
    const a = sidebarSections();
    a[0].items.push({ label: 'x', href: '/x' });
    const b = sidebarSections();
    expect(b[0].items.length).toBe(3);
  });
});
