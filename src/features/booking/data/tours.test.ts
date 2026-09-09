import { describe, it, expect } from 'vitest';
import {
  tours,
  tourPorId,
  tourPorNombre,
  formatImporteTour,
  formatFechaTour,
  formatRangoTour,
  cachesBrutos,
  tourPnl,
  tramosDelTour,
  formatHoras,
  formatHueco,
  notaDivisa,
  BOOKING_FEE_PCT,
} from './tours';

describe('tours — seed espejo del live (2026-09-09, 10:08-10:14 CEST)', () => {
  it('cada gira lleva el UUID con el que el live la enlaza en /tours/:tourId', () => {
    expect(tours.map((t) => t.id)).toEqual([
      '5c5f62d8-83a3-422c-86de-733e1d8241e5',
      'c68ade2f-5f01-4686-869c-34e744cf445a',
      'db6247ed-d98e-476d-a0fb-3b0ab4675267',
    ]);
    expect(tourPorId('c68ade2f-5f01-4686-869c-34e744cf445a')?.nombre).toBe('LATAM Sept 2026');
  });

  it('son las tres giras del live, en orden y todas en Planificando', () => {
    expect(tours.map((t) => t.nombre)).toEqual([
      'Spain Sept 2026',
      'LATAM Sept 2026',
      'ART NO LOGIA Sept 2026',
    ]);
    expect(tours.every((t) => t.estado === 'planificando')).toBe(true);
  });

  it('cada tarjeta lleva artista, territorio y número de shows del live', () => {
    const spain = tourPorNombre('Spain Sept 2026')!;
    const latam = tourPorNombre('LATAM Sept 2026')!;
    const artnologia = tourPorNombre('ART NO LOGIA Sept 2026')!;

    expect([spain.artista, spain.territorio, spain.shows.length]).toEqual([
      'Milan Torne',
      'Spain',
      0,
    ]);
    expect([latam.artista, latam.territorio, latam.shows.length]).toEqual([
      'Claudia Tejeda',
      'Latinoamérica',
      3,
    ]);
    expect([artnologia.artista, artnologia.territorio, artnologia.shows.length]).toEqual([
      'ART NO LOGIA',
      'Latinoamérica',
      3,
    ]);
  });

  it('el rango de fechas sale como en el live: rango, sólo desde, o vacío', () => {
    expect(formatRangoTour(tourPorNombre('Spain Sept 2026')!)).toBe('30 oct 2026 → 11 nov 2026');
    expect(formatRangoTour(tourPorNombre('LATAM Sept 2026')!)).toBe('17 sept 2026');
    expect(formatRangoTour(tourPorNombre('ART NO LOGIA Sept 2026')!)).toBe('');
  });

  it('formatea los importes en la divisa del tour', () => {
    expect(formatImporteTour(1450, 'USD')).toBe('1450,00\u00A0US$');
    expect(formatImporteTour(0, 'EUR')).toBe('0,00\u00A0€');
    expect(formatImporteTour(3520, 'USD')).toBe('3520,00\u00A0US$');
  });

  it('formatea la fecha corta de cada parada del itinerario', () => {
    expect(formatFechaTour('2026-09-18')).toBe('18 sept');
    expect(formatFechaTour('2026-10-09')).toBe('09 oct');
  });
});

describe('tourPnl — el P&L de la gira', () => {
  it('el booking fee es el 20 % del caché bruto', () => {
    expect(BOOKING_FEE_PCT).toBe(0.2);
  });

  it('reproduce al céntimo el P&L de LATAM Sept 2026', () => {
    const latam = tourPorNombre('LATAM Sept 2026')!;
    expect(cachesBrutos(latam)).toBe(4400);

    const pnl = tourPnl(latam);
    expect(pnl.cachesNetos).toBe(3520);
    expect(pnl.gastosArtista).toBe(0);
    expect(pnl.netoArtista).toBe(3520);
    expect(pnl.bookingFee).toBe(880);
    expect(pnl.gastosAgencia).toBe(0);
    expect(pnl.margenAgencia).toBe(880);
  });

  it('reproduce al céntimo el P&L de ART NO LOGIA Sept 2026', () => {
    const pnl = tourPnl(tourPorNombre('ART NO LOGIA Sept 2026')!);
    expect(pnl.cachesNetos).toBe(4740);
    expect(pnl.netoArtista).toBe(4740);
    expect(pnl.bookingFee).toBe(1185);
    expect(pnl.margenAgencia).toBe(1185);
  });

  it('una gira sin shows da un P&L a cero', () => {
    const pnl = tourPnl(tourPorNombre('Spain Sept 2026')!);
    expect(pnl.cachesNetos).toBe(0);
    expect(pnl.netoArtista).toBe(0);
    expect(pnl.bookingFee).toBe(0);
    expect(pnl.margenAgencia).toBe(0);
  });
});

describe('tramosDelTour — traslados entre paradas', () => {
  it('calcula los dos tramos de LATAM con las millas y las horas del live', () => {
    const tramos = tramosDelTour(tourPorNombre('LATAM Sept 2026')!);
    expect(tramos).toHaveLength(2);

    expect(tramos[0].km).toBe(1055);
    expect(tramos[0].millas).toBe(656);
    expect(tramos[0].horas).toBe(3.9);
    expect(tramos[0].huecoDias).toBe(1);

    expect(tramos[1].km).toBe(1044);
    expect(tramos[1].millas).toBe(649);
    expect(tramos[1].horas).toBe(3.9);
    expect(tramos[1].huecoDias).toBe(7);
  });

  it('calcula los dos tramos de ART NO LOGIA con las millas y las horas del live', () => {
    const tramos = tramosDelTour(tourPorNombre('ART NO LOGIA Sept 2026')!);
    expect(tramos.map((t) => [t.km, t.millas, t.horas, t.huecoDias])).toEqual([
      [4898, 3044, 9, 7],
      [1899, 1180, 5, 1],
    ]);
  });

  it('una gira sin shows no tiene tramos', () => {
    expect(tramosDelTour(tourPorNombre('Spain Sept 2026')!)).toEqual([]);
  });

  it('el total de traslados es la suma de los tramos, como en el live', () => {
    const latam = tramosDelTour(tourPorNombre('LATAM Sept 2026')!);
    expect(latam.reduce((acc, t) => acc + t.km, 0)).toBe(2099);
    expect(formatHoras(latam.reduce((acc, t) => acc + t.horas, 0))).toBe('7.8');

    const artnologia = tramosDelTour(tourPorNombre('ART NO LOGIA Sept 2026')!);
    expect(artnologia.reduce((acc, t) => acc + t.km, 0)).toBe(6797);
    expect(formatHoras(artnologia.reduce((acc, t) => acc + t.horas, 0))).toBe('14');
  });
});

describe('formatos del itinerario', () => {
  it('quita el decimal cuando las horas son enteras, como el live', () => {
    expect(formatHoras(3.9)).toBe('3.9');
    expect(formatHoras(14)).toBe('14');
    expect(formatHoras(9)).toBe('9');
  });

  it('pone el hueco en singular cuando es un solo día', () => {
    expect(formatHueco(1)).toBe('· 1 día de hueco');
    expect(formatHueco(7)).toBe('· 7 días de hueco');
    expect(formatHueco(0)).toBe('');
  });

  it('sólo enseña la nota de cambio cuando la gira no va en euros', () => {
    expect(notaDivisa('USD')).toBe(
      'En USD: 1 USD = 0.8583 EUR. Cachés = caché − booking fee (el management fee y los gastos de cada show se ven en su liquidación).'
    );
    expect(notaDivisa('EUR')).toBe('');
  });
});

describe('logística de cada parada', () => {
  it('las cuatro casillas del live salen pendientes en las tres giras', () => {
    const paradas = tours.flatMap((t) => t.shows);
    expect(paradas).not.toHaveLength(0);
    for (const parada of paradas) {
      expect(parada.logistica).toEqual({
        vuelo: 'pendiente',
        hotel: 'pendiente',
        ground: 'pendiente',
        visado: 'pendiente',
      });
    }
  });
});
