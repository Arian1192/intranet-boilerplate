import { describe, it, expect } from 'vitest';
import {
  PESTANAS_REPORTE,
  ESTADOS_REPORTE,
  formatEurosReporte,
  kpisDashboard,
  feesPorArtista,
  TICKS_FEES,
  COLOR_BOOKING,
  COLOR_MANAGEMENT,
  kpisPorAgente,
  TICKS_COMISION,
  tablaAgentes,
  CABECERAS_AGENTES,
  NOTA_AGENTES,
  artistasSelect,
  VACIO_VISTA_ARTISTA,
  kpisComisiones,
  comisionesPorAgente,
  cargaPorPersona,
  ROLES_REPARTO,
  repartoPorArtista,
  artistasSinAsignar,
  inicialesPersona,
} from './reporte';

describe('formatEurosReporte', () => {
  it('escribe el importe con el espacio duro (U+00A0) del live', () => {
    expect(formatEurosReporte(6450)).toBe('6450,00\u00a0€');
    expect(formatEurosReporte(0)).toBe('0,00\u00a0€');
  });

  it('agrupa los millares sólo a partir de cinco cifras, como el live', () => {
    expect(formatEurosReporte(22650)).toBe('22.650,00\u00a0€');
    expect(formatEurosReporte(4200)).toBe('4200,00\u00a0€');
  });
});

describe('los controles de la pantalla', () => {
  it('son las tres pestañas y los tres estados del live', () => {
    expect(PESTANAS_REPORTE).toEqual(['Resumen', 'Comisiones de agentes', 'Reparto de artistas']);
    expect(ESTADOS_REPORTE).toEqual(['Liquidados', 'Pendientes de liquidar', 'Todos']);
  });
});

describe('Resumen · dashboard general', () => {
  it('son los cinco KPI de la foto', () => {
    expect(kpisDashboard.map((k) => [k.etiqueta, k.valor])).toEqual([
      ['Shows liquidados', '23'],
      ['Booking fees', '6450,00\u00a0€'],
      ['Management fees', '1512,83\u00a0€'],
      ['Total gastado', '1806,98\u00a0€'],
      ['Artista más rentable', 'Los Canarios'],
    ]);
  });

  it('el artista más rentable lleva sus dos pies', () => {
    expect(kpisDashboard[4].pies).toEqual(['BF 1300,00\u00a0€', 'MF 947,47\u00a0€']);
  });
});

describe('Resumen · gráfico de fees apilados', () => {
  it('son los 13 artistas del live, de más a menos', () => {
    expect(feesPorArtista).toHaveLength(13);
    expect(feesPorArtista[0]).toEqual({
      artista: 'Los Canarios',
      booking: 1300,
      management: 947.47,
    });
    expect(feesPorArtista[1]).toEqual({ artista: 'Brenda Serna', booking: 1710, management: 0 });
    expect(feesPorArtista[12]).toEqual({ artista: 'Marian Ariss', booking: 200, management: 0 });
  });

  it('sus dos series suman exactamente los KPI de la cabecera', () => {
    const booking = feesPorArtista.reduce((t, f) => t + f.booking, 0);
    const management = feesPorArtista.reduce((t, f) => t + f.management, 0);
    expect(booking).toBe(6450);
    expect(Number(management.toFixed(2))).toBe(1512.84);
  });

  it('el más rentable del gráfico es el del KPI', () => {
    expect(feesPorArtista[0].booking).toBe(1300);
    expect(feesPorArtista[0].management).toBe(947.47);
  });

  it('lleva el eje y los dos colores literales del live', () => {
    expect(TICKS_FEES).toEqual([0, 600, 1200, 1800, 2400]);
    expect(COLOR_BOOKING).toBe('#44444c');
    expect(COLOR_MANAGEMENT).toBe('#f59e0b');
  });
});

describe('Resumen · por agente', () => {
  it('son los cuatro KPI del bloque', () => {
    expect(kpisPorAgente.map((k) => [k.etiqueta, k.valor])).toEqual([
      ['Total comisiones', '1747,50\u00a0€'],
      ['Agente top (comisión)', 'Yenifer Bernardo'],
      ['Más fechas cerradas', 'Yenifer Bernardo'],
      ['Agentes activos', '5'],
    ]);
    expect(kpisPorAgente[1].pies).toEqual(['1227,50\u00a0€']);
    expect(kpisPorAgente[2].pies).toEqual(['14 cierres']);
  });

  it('la tabla trae las seis columnas y las cinco filas del live', () => {
    expect(CABECERAS_AGENTES).toEqual([
      'Agente',
      'Cierres',
      'Fee bruto',
      'Fee medio',
      'Booking fees',
      'Comisión',
    ]);
    expect(tablaAgentes).toHaveLength(5);
    expect(tablaAgentes[0]).toEqual({
      agente: 'Yenifer Bernardo',
      cierres: 14,
      feeBruto: 22650,
      feeMedio: 1617.86,
      bookingFees: 4810,
      comision: 1227.5,
    });
    expect(tablaAgentes[4].agente).toBe('Oscar Buch');
    expect(tablaAgentes[4].comision).toBe(25);
  });

  it('las comisiones de la tabla suman el KPI de total', () => {
    const total = tablaAgentes.reduce((t, f) => t + f.comision, 0);
    expect(formatEurosReporte(total)).toBe('1747,50\u00a0€');
  });

  it('el eje del gráfico de comisiones da cabida a la mayor', () => {
    expect(TICKS_COMISION).toEqual([0, 350, 700, 1050, 1400]);
    expect(Math.max(...tablaAgentes.map((f) => f.comision))).toBeLessThan(1400);
  });

  it('cierra con la nota al pie del live', () => {
    expect(NOTA_AGENTES).toBe(
      'Cierres = fechas que trae el agente (de origen, o el oficial del artista si no hay agente de origen). La comisión incluye lo que gana como oficial y como origen en todos los shows del filtro.'
    );
  });
});

describe('Resumen · vista por artista', () => {
  it('el desplegable trae los 193 artistas del catálogo largo', () => {
    expect(artistasSelect).toHaveLength(193);
    expect(artistasSelect[0]).toBe('Aaron Martin');
    expect(artistasSelect[artistasSelect.length - 1]).toBe('Xandro');
  });

  it('arranca con el vacío literal del live', () => {
    expect(VACIO_VISTA_ARTISTA).toBe('Selecciona un artista para ver su detalle.');
  });
});

describe('pestaña Comisiones de agentes', () => {
  it('son tres KPI y ningún abono hecho', () => {
    expect(kpisComisiones.map((k) => [k.etiqueta, k.valor])).toEqual([
      ['Devengado total', '1747,50\u00a0€'],
      ['Abonado', '0,00\u00a0€'],
      ['Pendiente de abonar', '1747,50\u00a0€'],
    ]);
  });

  it('lista los cinco agentes con su devengado, abonado y pendiente', () => {
    expect(comisionesPorAgente).toHaveLength(5);
    expect(comisionesPorAgente[0]).toEqual({
      agente: 'Yenifer Bernardo',
      pie: '15 shows liquidados · 0 abonos',
      devengado: 1227.5,
      abonado: 0,
      pendiente: 1227.5,
    });
    expect(comisionesPorAgente[4].pie).toBe('1 show liquidado · 0 abonos');
  });

  it('lo devengado menos lo abonado es lo pendiente', () => {
    for (const fila of comisionesPorAgente) {
      expect(fila.pendiente).toBe(fila.devengado - fila.abonado);
    }
  });

  it('los cinco cuadran con el KPI de devengado total', () => {
    const total = comisionesPorAgente.reduce((t, f) => t + f.devengado, 0);
    expect(formatEurosReporte(total)).toBe('1747,50\u00a0€');
  });
});

describe('pestaña Reparto de artistas · carga por persona', () => {
  it('son los tres roles del live, cada uno con sus 41 artistas', () => {
    expect(cargaPorPersona.map((g) => g.rol)).toEqual(ROLES_REPARTO);
    expect(cargaPorPersona.map((g) => g.meta)).toEqual([
      '8 pers. · 41 artistas',
      '2 pers. · 41 artistas',
      '4 pers. · 41 artistas',
    ]);
  });

  it('el número de personas del rótulo es el de la lista', () => {
    for (const grupo of cargaPorPersona) {
      expect(grupo.meta.startsWith(`${grupo.filas.length} pers.`)).toBe(true);
    }
  });

  it('sólo Advancing lleva el aviso rosa de sin asignar', () => {
    expect(cargaPorPersona[0].sinAsignar).toBeUndefined();
    expect(cargaPorPersona[1].sinAsignar).toEqual({ artistas: 1, bolos: 0 });
    expect(cargaPorPersona[2].sinAsignar).toBeUndefined();
  });
});

describe('pestaña Reparto de artistas · por artista', () => {
  it('son los mismos 41 artistas de /artistas', () => {
    expect(repartoPorArtista).toHaveLength(41);
    expect(repartoPorArtista[0].nombre).toBe('Aaron Martin');
    expect(repartoPorArtista[40].nombre).toBe('Vidaloca');
  });

  it('cada artista trae sus tres roles', () => {
    for (const artista of repartoPorArtista) {
      expect(Object.keys(artista.roles)).toEqual(ROLES_REPARTO);
    }
  });

  it('el primero calca la fila del live', () => {
    const aaron = repartoPorArtista[0];
    expect(aaron.booking).toBe(true);
    expect(aaron.management).toBe(true);
    expect(aaron.bolos).toBe(3);
    expect(aaron.roles.Agentes.map((p) => p.corto)).toEqual(['Aldo']);
    expect(aaron.roles.Advancing.map((p) => p.completo)).toEqual(['Joe Coe']);
    expect(aaron.roles['Logística'].map((p) => p.corto)).toEqual(['Alex', 'Meritxell']);
  });

  it('el único hueco del live es el Advancing de Sadkiel', () => {
    expect(artistasSinAsignar(repartoPorArtista).map((a) => a.nombre)).toEqual(['Sadkiel']);
  });

  it('ese hueco es justo el que cuenta el aviso rosa de Advancing', () => {
    expect(artistasSinAsignar(repartoPorArtista)).toHaveLength(
      cargaPorPersona[1].sinAsignar!.artistas
    );
  });

  it('las personas del reparto son las mismas que las de la carga', () => {
    const enCarga = new Set(cargaPorPersona.flatMap((g) => g.filas.map((f) => f.nombre)));
    for (const artista of repartoPorArtista) {
      for (const rol of ROLES_REPARTO) {
        for (const persona of artista.roles[rol]) {
          expect(enCarga.has(persona.completo)).toBe(true);
        }
      }
    }
  });
});

describe('inicialesPersona', () => {
  it('toma la inicial del nombre y la del apellido', () => {
    expect(inicialesPersona('Aldo Messina')).toBe('AM');
    expect(inicialesPersona('Alex González')).toBe('AG');
    expect(inicialesPersona('Meritxell Pareja Casalí')).toBe('MC');
    expect(inicialesPersona('Yenifer Bernardo')).toBe('YB');
  });

  it('con un solo nombre repite sus dos primeras letras', () => {
    expect(inicialesPersona('Sadkiel')).toBe('SA');
  });
});
