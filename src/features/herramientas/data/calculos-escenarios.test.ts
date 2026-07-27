import { describe, it, expect } from 'vitest';
import {
  ticketingBrutoWaterfall, vipBruto, calcularBrutosEscenario,
  calcularEscenariosComparativa, calcularGastoPorCategoria,
} from './calculos-escenarios';
import { calcularResultadoAcuerdo } from './calculos-acuerdo';
import { seedProyecciones } from './seed';

const p = seedProyecciones[0];

describe('ticketingBrutoWaterfall', () => {
  it('agota los releases en orden hasta cubrir el objetivo, exacto en el borde de una fila', () => {
    // Early Access(100)+Release1(200)+Release3(150) = 450 exacto
    expect(ticketingBrutoWaterfall(p.ticketing, 450)).toBeCloseTo(4600, 2);
  });

  it('corta a mitad de fila (caso no ejercitado por el seed): objetivo 470 toma 20 de la 4ª fila (precio 15)', () => {
    // 450 acumuladas + 20 de "Online · Release 2" (precio 15) = 300
    expect(ticketingBrutoWaterfall(p.ticketing, 470)).toBeCloseTo(4600 + 20 * 15, 2);
  });

  it('objetivo 0 da bruto 0; objetivo mayor que el total configurado satura en el total (6125)', () => {
    expect(ticketingBrutoWaterfall(p.ticketing, 0)).toBe(0);
    expect(ticketingBrutoWaterfall(p.ticketing, 10000)).toBeCloseTo(6125, 2);
  });
});

describe('vipBruto', () => {
  it('es la suma cruda mesas×prob×precio, SIN multiplicador de escenario (ver spec §3.3)', () => {
    expect(vipBruto(p.mesasVip)).toBeCloseTo(12790, 2);
  });
});

describe('calcularBrutosEscenario — reproduce exactamente los 3 escenarios del live', () => {
  it('Base (75%): ticketing 4.600€, vip 12.790€, barras 15.000€, comida 1.125€, merch 0€', () => {
    const b = calcularBrutosEscenario(p, 'base');
    expect(b.ticketing).toBeCloseTo(4600, 2);
    expect(b.mesasVip).toBeCloseTo(12790, 2);
    expect(b.barras).toBeCloseTo(15000, 2);
    expect(b.comida).toBeCloseTo(1125, 2);
    expect(b.merchandising).toBe(0);
  });

  it('Pesimista (50%): ticketing 2.800€, barras 10.500€, comida 787,50€', () => {
    const b = calcularBrutosEscenario(p, 'pesimista');
    expect(b.ticketing).toBeCloseTo(2800, 2);
    expect(b.barras).toBeCloseTo(10500, 2);
    expect(b.comida).toBeCloseTo(787.5, 2);
  });

  it('Optimista (100%): ticketing 6.125€ (todo el configurado), barras 19.500€, comida 1.462,50€', () => {
    const b = calcularBrutosEscenario(p, 'optimista');
    expect(b.ticketing).toBeCloseTo(6125, 2);
    expect(b.barras).toBeCloseTo(19500, 2);
    expect(b.comida).toBeCloseTo(1462.5, 2);
  });

  it('el Beneficio por acuerdo resultante reproduce EXACTAMENTE la tabla Escenarios del live', () => {
    const beneficio = (escenario: 'pesimista' | 'base' | 'optimista') =>
      calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, escenario), p.eventoAforo, p.gastos).beneficioPorAcuerdo;
    expect(beneficio('pesimista')).toBeCloseTo(-1134.69, 1);
    expect(beneficio('base')).toBeCloseTo(860.14, 1);
    expect(beneficio('optimista')).toBeCloseTo(2604.97, 1);
  });

  it('respeta asistenciaForzada cuando está definida (entradas objetivo = forzada - invitaciones)', () => {
    const forzado = { ...p, eventoAforo: { ...p.eventoAforo, asistenciaForzada: 150 } };
    // objetivo = 150 - 50 invitaciones = 100 -> solo la primera fila (Early Access, 100 entradas, precio 8) = 800
    const b = calcularBrutosEscenario(forzado, 'optimista');
    expect(b.ticketing).toBeCloseTo(800, 2);
  });
});

describe('calcularEscenariosComparativa', () => {
  it('devuelve las 3 filas con beneficio y margen exactos', () => {
    const filas = calcularEscenariosComparativa(p);
    expect(filas).toHaveLength(3);
    expect(filas[0]).toMatchObject({ escenario: 'pesimista', label: 'Pesimista' });
    expect(filas[0].beneficio).toBeCloseTo(-1134.69, 1);
    expect(filas[0].margen).toBeCloseTo(-26.2, 0);
    expect(filas[1].beneficio).toBeCloseTo(860.14, 1);
    expect(filas[2].beneficio).toBeCloseTo(2604.97, 1);
  });
});

describe('calcularGastoPorCategoria', () => {
  it('agrega por categoría, ordena descendente y calcula % redondeado (suma 100)', () => {
    const filas = calcularGastoPorCategoria(p.gastos);
    expect(filas).toEqual([
      { categoria: 'Artística', importe: 2400, pct: 44 },
      { categoria: 'Promoción', importe: 1500, pct: 27 },
      { categoria: 'Publicidad', importe: 1300, pct: 24 },
      { categoria: 'Staff', importe: 270, pct: 5 },
    ]);
  });

  it('con lista vacía devuelve []', () => {
    expect(calcularGastoPorCategoria([])).toEqual([]);
  });
});
