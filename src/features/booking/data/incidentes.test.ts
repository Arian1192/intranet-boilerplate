import { describe, it, expect } from 'vitest';
import {
  incidentes,
  TOTAL_INCIDENTES,
  ESTADOS_INCIDENTE,
  SEVERIDADES_INCIDENTE,
  CATEGORIAS_INCIDENTE,
  OWNERS_INCIDENTE,
  DEPARTAMENTOS_INCIDENTE,
  FILTROS_GUARDADOS,
  FILTROS_INCIDENTES_VACIO,
  edadDias,
  etiquetaEdad,
  edadEsVieja,
  formatFechaIncidente,
  filterIncidentes,
  ordenarPorSeveridad,
  agruparPorEstado,
  agruparPorMes,
  aplicarFiltroGuardado,
} from './incidentes';

describe('catálogos de incidentes', () => {
  it('tiene los cinco estados del live en el orden del tablero, con su badge', () => {
    expect(ESTADOS_INCIDENTE.map((e) => e.etiqueta)).toEqual([
      'Abierta',
      'En curso',
      'Bloqueada',
      'Resuelta',
      'Cerrada',
    ]);
    expect(ESTADOS_INCIDENTE.map((e) => e.badge)).toEqual([
      'bg-amber-100 text-amber-700',
      'bg-sky-100 text-sky-700',
      'bg-rose-100 text-rose-700',
      'bg-emerald-100 text-emerald-700',
      'bg-slate-100 text-slate-500',
    ]);
  });

  it('tiene las cuatro severidades en el orden del select', () => {
    expect(SEVERIDADES_INCIDENTE.map((s) => s.etiqueta)).toEqual([
      'Baja',
      'Media',
      'Alta',
      'Crítica',
    ]);
  });

  it('tiene las 11 categorías del live, en orden', () => {
    expect(CATEGORIAS_INCIDENTE).toEqual([
      'Viaje y logística',
      'Técnico y producción',
      'Contractual',
      'Pago',
      'Conducta del artista',
      'Conducta de promotor/comprador',
      'Venue y operaciones del evento',
      'Media y PR',
      'Staff e interno',
      'Legal y compliance',
      'Salud y seguridad',
    ]);
  });

  it('tiene los 19 owners y los 10 departamentos del live', () => {
    expect(OWNERS_INCIDENTE).toHaveLength(19);
    expect(OWNERS_INCIDENTE[0]).toBe('Alba G');
    expect(OWNERS_INCIDENTE[OWNERS_INCIDENTE.length - 1]).toBe('Yenifer Bernardo');
    expect(DEPARTAMENTOS_INCIDENTE).toHaveLength(10);
    expect(DEPARTAMENTOS_INCIDENTE[0]).toBe('ConceptOne (booking)');
    expect(DEPARTAMENTOS_INCIDENTE[DEPARTAMENTOS_INCIDENTE.length - 1]).toBe('Blackmoose (grupo)');
  });

  it('tiene los 8 filtros guardados, con «Sin asignar» en rosa', () => {
    expect(FILTROS_GUARDADOS.map((f) => f.etiqueta)).toEqual([
      'Todas (sin cerrar)',
      'Mis abiertos',
      'Sin resolver +7 días',
      'Críticos y Altos',
      'Sin asignar',
      'Este mes',
      'Preventables 90 días',
      'Recurrentes',
    ]);
    expect(FILTROS_GUARDADOS.find((f) => f.etiqueta === 'Sin asignar')?.tono).toBe('rose');
  });
});

describe('las incidencias del live', () => {
  it('son las siete del live', () => {
    expect(incidentes).toHaveLength(7);
    expect(TOTAL_INCIDENTES).toBe(7);
  });

  it('trae los códigos y títulos del live', () => {
    expect(incidentes.map((i) => i.codigo)).toEqual(['#9', '#8', '#7', '#6', '#5', '#4', '#2']);
    const fajardo = incidentes.find((i) => i.codigo === '#5');
    expect(fajardo?.titulo).toBe(
      'La pareja de Jose Fajardo se ha peleado con la novia del promotor.'
    );
    expect(fajardo?.categoria).toBe('Conducta del artista');
    expect(fajardo?.severidad).toBe('alta');
    expect(incidentes[0].categoria).toBeNull();
  });

  it('marca como confidencial sólo el flyer sin aprobar', () => {
    expect(incidentes.filter((i) => i.confidencial).map((i) => i.codigo)).toEqual(['#7']);
  });

  it('todas son de ConceptOne (booking), y sólo la resuelta tiene owner', () => {
    for (const incidente of incidentes) {
      expect(incidente.departamento).toBe('ConceptOne (booking)');
    }
    const conOwner = incidentes.filter((i) => i.owner !== null);
    expect(conOwner.map((i) => [i.codigo, i.owner])).toEqual([['#4', 'Sadkiel']]);
    expect(incidentes.filter((i) => i.estado !== 'abierta').map((i) => i.codigo)).toEqual(['#4']);
  });

  it('la séptima es la que la analítica dejaba adivinar, y coincide', () => {
    const septima = incidentes.find((i) => i.codigo === '#4');
    expect(septima).toMatchObject({
      categoria: 'Pago',
      severidad: 'media',
      estado: 'resuelta',
      preventable: true,
      fechaReporte: '2026-08-03',
    });
    // Es la que hace que «Pago» sean 2 en el recuento por categoría.
    expect(incidentes.filter((i) => i.categoria === 'Pago')).toHaveLength(2);
  });
});

describe('edad de una incidencia', () => {
  it('cuenta los días desde el reporte hasta la fecha de la foto', () => {
    expect(incidentes.map((i) => edadDias(i))).toEqual([1, 14, 29, 37, 37, 37, 46]);
  });

  it('se escribe con la «d» pegada, como el live', () => {
    expect(etiquetaEdad(37)).toBe('37d');
    expect(etiquetaEdad(1)).toBe('1d');
  });

  it('se pinta en rojo a partir de los 15 días', () => {
    expect(edadEsVieja(14)).toBe(false);
    expect(edadEsVieja(15)).toBe(true);
    expect(edadEsVieja(29)).toBe(true);
  });
});

describe('formatFechaIncidente', () => {
  it('escribe la fecha como el timeline del live', () => {
    expect(formatFechaIncidente('2026-09-08')).toBe('08 sept 2026');
    expect(formatFechaIncidente('2026-08-26')).toBe('26 ago 2026');
    expect(formatFechaIncidente('2026-07-25')).toBe('25 jul 2026');
  });
});

describe('filterIncidentes', () => {
  it('sin filtros devuelve las siete', () => {
    expect(filterIncidentes(incidentes, FILTROS_INCIDENTES_VACIO)).toHaveLength(7);
  });

  it('filtra por severidad', () => {
    const altas = filterIncidentes(incidentes, { ...FILTROS_INCIDENTES_VACIO, severidad: 'alta' });
    expect(altas.map((i) => i.codigo)).toEqual(['#5']);
  });

  it('filtra por categoría', () => {
    const pago = filterIncidentes(incidentes, { ...FILTROS_INCIDENTES_VACIO, categoria: 'Pago' });
    expect(pago.map((i) => i.codigo)).toEqual(['#6', '#4']);
  });

  it('«Abiertos (sin resolver)» deja fuera resueltas y cerradas', () => {
    const sinResolver = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      estado: '__abierto__',
    });
    expect(sinResolver).toHaveLength(6);
    expect(sinResolver.map((i) => i.codigo)).not.toContain('#4');
  });

  it('busca en el título sin distinguir mayúsculas ni acentos', () => {
    const encontradas = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      texto: 'LOGISTICA',
    });
    expect(encontradas.map((i) => i.codigo)).toEqual(['#2']);
  });

  it('filtra por artista', () => {
    const vidaloca = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      artista: 'vidaloca',
    });
    expect(vidaloca.map((i) => i.codigo)).toEqual(['#9']);
  });

  it('filtra por rango de fechas de reporte', () => {
    const agosto = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      desde: '2026-08-01',
      hasta: '2026-08-31',
    });
    expect(agosto.map((i) => i.codigo)).toEqual(['#8', '#7', '#6', '#5', '#4']);
  });

  it('filtra por owner sin asignar', () => {
    const conOwner = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      owner: 'Alba G',
    });
    expect(conOwner).toHaveLength(0);
  });

  it('el interruptor de confidencial deja sólo el flyer', () => {
    const confidenciales = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      confidencial: true,
    });
    expect(confidenciales.map((i) => i.codigo)).toEqual(['#7']);
  });

  it('el importe mínimo descarta las que no tienen impacto registrado', () => {
    const conImpacto = filterIncidentes(incidentes, {
      ...FILTROS_INCIDENTES_VACIO,
      impactoMinimo: 1,
    });
    expect(conImpacto).toHaveLength(0);
  });
});

describe('ordenarPorSeveridad', () => {
  it('pone las más graves arriba y respeta el orden del live', () => {
    expect(ordenarPorSeveridad(incidentes).map((i) => i.codigo)).toEqual([
      '#5',
      '#9',
      '#8',
      '#7',
      '#6',
      '#4',
      '#2',
    ]);
  });
});

describe('agruparPorEstado', () => {
  it('devuelve siempre las cinco columnas, aunque estén vacías', () => {
    const columnas = agruparPorEstado(incidentes);
    expect(columnas.map((c) => c.estado.etiqueta)).toEqual([
      'Abierta',
      'En curso',
      'Bloqueada',
      'Resuelta',
      'Cerrada',
    ]);
    expect(columnas.map((c) => c.incidentes.length)).toEqual([6, 0, 0, 1, 0]);
  });
});

describe('agruparPorMes', () => {
  it('agrupa por mes de reporte, del más reciente al más antiguo', () => {
    const meses = agruparPorMes(incidentes);
    expect(meses.map((m) => m.etiqueta)).toEqual([
      'septiembre de 2026',
      'agosto de 2026',
      'julio de 2026',
    ]);
    // Agosto son 5, que es justo lo que dice el gráfico de la analítica.
    expect(meses.map((m) => m.incidentes.length)).toEqual([1, 5, 1]);
  });

  it('dentro de cada mes ordena de la más reciente a la más antigua', () => {
    const agosto = agruparPorMes(incidentes)[1];
    expect(agosto.incidentes.map((i) => i.codigo)).toEqual(['#8', '#7', '#6', '#5', '#4']);
  });
});

describe('aplicarFiltroGuardado', () => {
  it('«Todas (sin cerrar)» deja seis: se lleva por delante la resuelta', () => {
    const sinCerrar = aplicarFiltroGuardado(incidentes, 'sin-cerrar');
    expect(sinCerrar).toHaveLength(6);
    expect(sinCerrar.map((i) => i.codigo)).not.toContain('#4');
  });

  it('«Sin asignar» deja las que no tienen owner', () => {
    expect(aplicarFiltroGuardado(incidentes, 'sin-asignar')).toHaveLength(6);
  });

  it('«Críticos y Altos» deja sólo la alta', () => {
    expect(aplicarFiltroGuardado(incidentes, 'criticos-altos').map((i) => i.codigo)).toEqual([
      '#5',
    ]);
  });

  it('«Sin resolver +7 días» deja fuera la de ayer y la ya resuelta', () => {
    expect(aplicarFiltroGuardado(incidentes, 'sin-resolver-7').map((i) => i.codigo)).toEqual([
      '#8',
      '#7',
      '#6',
      '#5',
      '#2',
    ]);
  });

  it('«Este mes» deja sólo la reportada en septiembre', () => {
    expect(aplicarFiltroGuardado(incidentes, 'este-mes').map((i) => i.codigo)).toEqual(['#9']);
  });

  it('«Mis abiertos» no deja ninguna: las seis están sin asignar', () => {
    expect(aplicarFiltroGuardado(incidentes, 'mis-abiertos')).toHaveLength(0);
  });

  it('«Preventables 90 días» deja la única clasificada como evitable', () => {
    expect(aplicarFiltroGuardado(incidentes, 'preventables-90').map((i) => i.codigo)).toEqual([
      '#4',
    ]);
  });

  it('«Recurrentes» no deja ninguna: ninguna visible tiene contraparte atribuida', () => {
    expect(aplicarFiltroGuardado(incidentes, 'recurrentes')).toHaveLength(0);
  });

  it('sin filtro guardado devuelve la lista entera', () => {
    expect(aplicarFiltroGuardado(incidentes, null)).toHaveLength(7);
  });
});
