import { describe, it, expect } from 'vitest';
import { clave, clavesMatriz, alternar, aplicarPlantilla, copiarDe } from './permisos';
import { BLOQUES_MATRIZ, CAJAS_PERMISOS, PERMISOS_PLANTILLA, cuentas, PLANTILLAS } from '../data/usuarios';

describe('dataset de /personal/usuarios', () => {
  it('trae los 4 bloques de matriz del live con sus filas', () => {
    expect(BLOQUES_MATRIZ.map((b) => [b.titulo, b.filas.length])).toEqual([
      ['CONCEPTONE · NAVEGACIÓN', 10],
      ['CONCEPTONE · FICHA DE SHOW', 13],
      ['CONCEPTONE · FICHA DE ARTISTA', 7],
      ['CONCEPTONE · MANAGEMENT', 3],
    ]);
  });

  it('las 33 filas tienen nombre único, que es lo que hace de clave', () => {
    const nombres = BLOQUES_MATRIZ.flatMap((b) => b.filas.map((f) => f.nombre));
    expect(nombres).toHaveLength(33);
    expect(new Set(nombres).size).toBe(33);
  });

  it('marca como «—» los permisos que no aplican', () => {
    const nav = BLOQUES_MATRIZ[0].filas;
    expect(nav.find((f) => f.nombre === 'Dashboard')!.editar).toBe('na');
    expect(nav.find((f) => f.nombre === 'Cobros')!.editar).toBe('check');
    const show = BLOQUES_MATRIZ[1].filas;
    expect(show.find((f) => f.nombre === 'Eliminar shows')!.editar).toBe('na');
  });

  it('trae las 11 cajas de permisos por módulo', () => {
    expect(CAJAS_PERMISOS).toHaveLength(11);
    expect(CAJAS_PERMISOS[0].titulo).toBe('ETRA AGENCY');
    expect(CAJAS_PERMISOS[CAJAS_PERMISOS.length - 1].items).toEqual(['Escribir novedades del grupo']);
  });

  it('trae las 20 cuentas del live con su estado', () => {
    expect(cuentas).toHaveLength(20);
    expect(cuentas.filter((c) => c.estado === 'Pendiente').map((c) => c.nombre)).toEqual([
      'Jassi Gonzalez Montes',
    ]);
    expect(cuentas.filter((c) => c.ficha === 'sin-ficha').map((c) => c.email)).toEqual([
      'test@blackmoose.es',
    ]);
    expect(cuentas.filter((c) => c.tipo === 'Portal').map((c) => c.nombre)).toEqual([
      'gelabertalba',
      'hello',
    ]);
  });
});

describe('clavesMatriz', () => {
  it('solo cuenta las celdas marcables, no las «—»', () => {
    const claves = clavesMatriz();
    expect(claves).toContain('Cobros|editar');
    expect(claves).not.toContain('Dashboard|editar');
    expect(claves).not.toContain('Eliminar shows|editar');
  });
});

describe('alternar', () => {
  it('marca y desmarca sin mutar el conjunto original', () => {
    const base = new Set<string>();
    const uno = alternar(base, 'Shows|ver');
    expect(uno.has('Shows|ver')).toBe(true);
    expect(base.size).toBe(0);
    expect(alternar(uno, 'Shows|ver').has('Shows|ver')).toBe(false);
  });
});

describe('aplicarPlantilla', () => {
  it('cada plantilla marca lo que marca en el live', () => {
    expect(PERMISOS_PLANTILLA['Booker']).toHaveLength(22);
    expect(PERMISOS_PLANTILLA['Logística']).toHaveLength(17);
    expect(PERMISOS_PLANTILLA['Advancing / Finanzas']).toHaveLength(24);
    expect(PERMISOS_PLANTILLA['Marketing']).toHaveLength(9);
    expect(PERMISOS_PLANTILLA['Project Manager']).toHaveLength(16);
  });

  it('hay plantilla para los 5 sellos', () => {
    for (const p of PLANTILLAS) expect(PERMISOS_PLANTILLA[p]).toBeDefined();
  });

  it('REEMPLAZA lo que hubiera de la matriz, no suma', () => {
    // Un ex-booker no puede quedarse viendo los fees al pasar a Marketing.
    const booker = aplicarPlantilla(new Set(), 'Booker');
    expect(booker.has('Oferta|editar')).toBe(true);

    const marketing = aplicarPlantilla(booker, 'Marketing');
    expect(marketing.has('Oferta|editar')).toBe(false);
    expect(marketing.has('Artwork|editar')).toBe(true);
    expect(marketing.size).toBe(9);
  });

  it('conserva los permisos de fuera de la matriz (cajas por módulo)', () => {
    const conCaja = new Set(['Ver CRUDA (pedidos y catálogo)']);
    const tras = aplicarPlantilla(conCaja, 'Marketing');
    expect(tras.has('Ver CRUDA (pedidos y catálogo)')).toBe(true);
    expect(tras.has('Artwork|editar')).toBe(true);
  });

  it('una plantilla desconocida deja solo lo de fuera de la matriz', () => {
    const previo = aplicarPlantilla(new Set(), 'Booker');
    expect(aplicarPlantilla(previo, 'Inventada').size).toBe(0);
  });
});

describe('copiarDe', () => {
  it('clona los permisos de otra cuenta sin compartir referencia', () => {
    const origen = new Set([clave('Shows', 'ver')]);
    const copia = copiarDe(origen);
    copia.add(clave('Cobros', 'ver'));
    expect(origen.size).toBe(1);
    expect(copia.size).toBe(2);
  });
});
