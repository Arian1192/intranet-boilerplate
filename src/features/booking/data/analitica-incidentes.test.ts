import { describe, it, expect } from 'vitest';
import {
  KPIS_ANALITICA,
  IMPACTO_ECONOMICO,
  VACIO_IMPACTO,
  CABECERAS_IMPACTO,
  incidentesPorCategoria,
  incidentesPorDepartamento,
  incidentesPorMes,
  MAX_EJE_MES,
  TICKS_EJE_MES,
  resolucionPorSeveridad,
  resolucionPorDepartamento,
  preventables,
  TICKS_EJE_PREVENTABLES,
  counterpartiesRecurrentes,
  abiertosMasDe14Dias,
  lagPorDepartamento,
  formatImporteAnalitica,
} from './analitica-incidentes';

describe('formatImporteAnalitica', () => {
  it('usa el espacio duro (U+00A0) que escribe el live antes del €', () => {
    expect(formatImporteAnalitica(0)).toBe('0,00\u00a0€');
    expect(formatImporteAnalitica(1806.98)).toBe('1806,98\u00a0€');
    expect(formatImporteAnalitica(0)).not.toBe('0,00 €');
  });
});

describe('los 4 KPI de la analítica', () => {
  it('son los de la foto, con su pie', () => {
    expect(KPIS_ANALITICA).toEqual([
      { etiqueta: 'Incidentes (rango)', valor: '7', pie: 'de 7 totales' },
      { etiqueta: 'Resolución media', valor: '3 d', pie: '1 resueltos' },
      { etiqueta: '% preventables', valor: '100%', pie: '1 de 1 con dato' },
      { etiqueta: 'Impacto neto', valor: '0,00\u00a0€', tono: 'rose' },
    ]);
  });
});

describe('bloque de impacto económico', () => {
  it('está todo a cero, como en el live', () => {
    expect(IMPACTO_ECONOMICO.map((c) => c.valor)).toEqual([0, 0, 0, 0]);
    expect(IMPACTO_ECONOMICO.map((c) => c.etiqueta)).toEqual([
      'Coste incurrido',
      'Ingreso perdido',
      'Recuperado',
      'Neto',
    ]);
  });

  it('sus dos tablas están vacías con el literal del live', () => {
    expect(VACIO_IMPACTO).toBe('Sin impacto registrado.');
    expect(CABECERAS_IMPACTO).toEqual(['', 'Coste', 'Perdido', 'Recup.', 'Neto']);
  });
});

describe('recuentos por categoría y departamento', () => {
  it('reparte las 7 incidencias entre 4 categorías', () => {
    expect(incidentesPorCategoria).toEqual([
      { etiqueta: 'Sin categoría', valor: 3 },
      { etiqueta: 'Pago', valor: 2 },
      { etiqueta: 'Conducta del artista', valor: 1 },
      { etiqueta: 'Staff e interno', valor: 1 },
    ]);
    expect(incidentesPorCategoria.reduce((t, c) => t + c.valor, 0)).toBe(7);
  });

  it('las pone todas en ConceptOne (booking)', () => {
    expect(incidentesPorDepartamento).toEqual([{ etiqueta: 'ConceptOne (booking)', valor: 7 }]);
  });
});

describe('incidentes por mes', () => {
  it('son los tres meses de la foto, y suman 7', () => {
    expect(incidentesPorMes).toEqual([
      { etiqueta: 'jul 26', valor: 1 },
      { etiqueta: 'ago 26', valor: 5 },
      { etiqueta: 'sep 26', valor: 1 },
    ]);
    expect(incidentesPorMes.reduce((t, m) => t + m.valor, 0)).toBe(7);
  });

  it('el eje llega a 8, con las marcas del live', () => {
    expect(MAX_EJE_MES).toBe(8);
    expect(TICKS_EJE_MES).toEqual([0, 2, 4, 6, 8]);
  });
});

describe('resolución media', () => {
  it('por severidad, sólo «Media» tiene dato', () => {
    expect(resolucionPorSeveridad).toEqual([
      { etiqueta: 'Baja', valor: null, casos: 0 },
      { etiqueta: 'Media', valor: '3 d', casos: 1 },
      { etiqueta: 'Alta', valor: null, casos: 0 },
      { etiqueta: 'Crítica', valor: null, casos: 0 },
    ]);
  });

  it('por departamento, 3 d sobre un caso', () => {
    expect(resolucionPorDepartamento).toEqual([
      { etiqueta: 'ConceptOne (booking)', valor: '3 d', casos: 1 },
    ]);
  });
});

describe('preventables', () => {
  it('el 100% de 1 clasificado, con la barra de agosto al tope', () => {
    expect(preventables.porcentaje).toBe(100);
    expect(preventables.clasificados).toBe(1);
    expect(preventables.porMes).toEqual([{ etiqueta: 'ago 26', valor: 100 }]);
    expect(TICKS_EJE_PREVENTABLES).toEqual([0, 25, 50, 75, 100]);
  });
});

describe('counterparties recurrentes', () => {
  it('son las dos de la foto, con su tipo', () => {
    expect(counterpartiesRecurrentes).toEqual([
      { nombre: 'Marina Beach Club', tipo: 'Venue', valor: 1 },
      { nombre: 'Joe Coe', tipo: 'Staff', valor: 1 },
    ]);
  });
});

describe('abiertos con más de 14 días', () => {
  it('es un solo grupo sin owner con sus cuatro incidencias', () => {
    expect(abiertosMasDe14Dias).toHaveLength(1);
    const [grupo] = abiertosMasDe14Dias;
    expect(grupo.owner).toBe('Sin owner');
    expect(grupo.total).toBe(4);
    expect(grupo.incidencias.map((i) => i.codigo)).toEqual(['#2', '#5', '#6', '#7']);
    expect(grupo.incidencias.map((i) => i.dias)).toEqual(['46 d', '37 d', '37 d', '29 d']);
  });

  it('el total del badge cuadra con las incidencias listadas', () => {
    for (const grupo of abiertosMasDe14Dias) {
      expect(grupo.total).toBe(grupo.incidencias.length);
    }
  });
});

describe('lag medio de reporte', () => {
  it('es 0 d sobre tres incidencias', () => {
    expect(lagPorDepartamento).toEqual([
      { etiqueta: 'ConceptOne (booking)', valor: '0 d', casos: 3 },
    ]);
  });
});
