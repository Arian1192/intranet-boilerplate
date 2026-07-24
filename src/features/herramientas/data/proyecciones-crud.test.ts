import { describe, it, expect } from 'vitest';
import { createBlankProyeccion, duplicateProyeccion, removeProyeccion, updateProyeccion } from './proyecciones-crud';
import { seedProyecciones } from './seed';

describe('createBlankProyeccion', () => {
  it('crea una proyección en blanco con estado borrador y los defaults del live', () => {
    const p = createBlankProyeccion();
    expect(p.id).toBeTruthy();
    expect(p.nombre).toBe('Nuevo evento');
    expect(p.estado).toBe('borrador');
    expect(p.responsables).toEqual([]);
    expect(p.gastos).toEqual([]);
    expect(p.eventoAforo.duracionHoras).toBe(6);
    expect(p.eventoAforo.ivaTicketingPct).toBe(10);
    expect(p.ajustesEscenarios).toEqual({
      multiplicadorPesimistaPct: 75, multiplicadorBasePct: 100, multiplicadorOptimistaPct: 115, viasBreakeven: [],
    });
    expect(p.cajaReal).toEqual([]);
  });

  it('cada llamada produce un id distinto', () => {
    const a = createBlankProyeccion();
    const b = createBlankProyeccion();
    expect(a.id).not.toBe(b.id);
  });
});

describe('duplicateProyeccion', () => {
  it('copia todos los datos con un id nuevo, estado borrador y nombre con sufijo', () => {
    const original = seedProyecciones[0];
    const copia = duplicateProyeccion(original);
    expect(copia.id).not.toBe(original.id);
    expect(copia.nombre).toBe('PQ @ SLS Barcelona (copia)');
    expect(copia.estado).toBe('borrador');
    expect(copia.gastos).toEqual(original.gastos);
    expect(copia.actualizadoEn).toBeUndefined();
  });
});

describe('removeProyeccion', () => {
  it('quita solo la proyección con ese id', () => {
    const lista = [createBlankProyeccion(), createBlankProyeccion()];
    const result = removeProyeccion(lista, lista[0].id);
    expect(result).toEqual([lista[1]]);
  });
});

describe('updateProyeccion', () => {
  it('mezcla el patch y actualiza actualizadoEn solo en la proyección con ese id', () => {
    const lista = seedProyecciones;
    const [p] = lista;
    const result = updateProyeccion(lista, p.id, { estado: 'rechazada' });
    expect(result[0].estado).toBe('rechazada');
    expect(result[0].actualizadoEn).toBeTruthy();
    expect(result[0].nombre).toBe(p.nombre);
  });

  it('no muta el array ni el objeto originales', () => {
    const lista = seedProyecciones;
    const result = updateProyeccion(lista, lista[0].id, { estado: 'rechazada' });
    expect(result).not.toBe(lista);
    expect(lista[0].estado).toBe('aprobada');
  });
});
