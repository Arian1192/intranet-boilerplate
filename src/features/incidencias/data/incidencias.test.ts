import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { INCIDENCIA_ESTADOS, listIncidencias, countByEstado, filterByEstado } from './incidencias';
import type { Incidencia } from './incidencias';

describe('incidencias data', () => {
  it('INCIDENCIA_ESTADOS declara los 5 estados en el orden fijo del live', () => {
    expect(INCIDENCIA_ESTADOS.map((e) => e.id)).toEqual([
      'nueva', 'auto', 'en_curso', 'resuelta', 'descartada',
    ]);
    expect(INCIDENCIA_ESTADOS.map((e) => e.label)).toEqual([
      'NUEVAS', 'AUTO', 'EN CURSO', 'RESUELTAS', 'DESCARTADAS',
    ]);
  });

  it('listIncidencias devuelve las 8 filas semilla en el orden exacto del live', () => {
    const list = listIncidencias();
    expect(list).toHaveLength(8);
    expect(list.map((i) => i.estado)).toEqual([
      'descartada', 'resuelta', 'descartada', 'descartada', 'nueva', 'descartada', 'resuelta', 'auto',
    ]);
    expect(list[0].texto).toBe(
      'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?'
    );
    expect(list[0].tipo).toBe('idea');
    expect(list[0].hasAttachment).toBe(false);
    expect(list[0].routePath).toBe('/');
    expect(list[0].reporterInitials).toBe('FV');
    expect(list[0].reporterColor).toBe('#EA580C');
    expect(list[1].tipo).toBeUndefined();
    expect(list[1].hasAttachment).toBe(true);
    expect(list[1].routePath).toBe('/euphoric/calendario');
    expect(list[1].reporterInitials).toBe('AG');
    expect(list[1].reporterColor).toBe('#16A34A');
    expect(list[4].reporterInitials).toBe('JC');
    expect(list[4].routePath).toBe('/shows/nuevo');
    // Filas 4/6/7/8: Carlos Pego, que en el live usa foto de perfil en vez de iniciales.
    expect(list[3].reporterName).toBe('Carlos Pego');
    expect(list[3].reporterInitials).toBeUndefined();
    expect(list[3].reporterColor).toBeUndefined();
    expect(list[4].reporterName).toBe('Joe Coe');
    expect(list[4].reporterColor).toBe('#2563EB');
    expect(list[6].routePath).toBe('/shows/08ea3304-af17-4722-84d5-d3b63347fe74');
    expect(list[7].routePath).toBe('/shows/08ea3304-af17-4722-84d5-d3b63347fe74');
  });

  it('listIncidencias es inmutable: mutar el array devuelto no afecta la siguiente llamada', () => {
    const first = listIncidencias();
    const extra: Incidencia = { id: 'x', estado: 'nueva', texto: 'x', hasAttachment: false, routePath: '/' };
    first.push(extra);
    first[0].texto = 'mutado';
    expect(listIncidencias()).toHaveLength(8);
    expect(listIncidencias()[0].texto).not.toBe('mutado');
    expect(listIncidencias()).not.toBe(first);
  });

  it('countByEstado: nueva 1, auto 1, en_curso 0, resuelta 2, descartada 4', () => {
    expect(countByEstado(listIncidencias())).toEqual({
      nueva: 1, auto: 1, en_curso: 0, resuelta: 2, descartada: 4,
    });
  });

  it('filterByEstado filtra por cada estado y null devuelve las 8 sin filtrar', () => {
    const list = listIncidencias();
    expect(filterByEstado(list, null)).toHaveLength(8);
    expect(filterByEstado(list, 'nueva')).toHaveLength(1);
    expect(filterByEstado(list, 'auto')).toHaveLength(1);
    expect(filterByEstado(list, 'en_curso')).toHaveLength(0);
    expect(filterByEstado(list, 'resuelta')).toHaveLength(2);
    expect(filterByEstado(list, 'descartada')).toHaveLength(4);
  });

  it('filterByEstado no muta la lista original', () => {
    const list = listIncidencias();
    filterByEstado(list, 'nueva');
    expect(list).toHaveLength(8);
  });
});
