import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import {
  STATUSES, pieces, TEAMS,
  statusesFor, statusesForTeam, piecesFor,
  filterPieces, groupByTeam, countByStatus, teamCounts,
} from './contenidos';

describe('contenidos data', () => {
  it('Mixmag tiene 9 estados en orden, MAQUETACIÓN solo en revista', () => {
    const s = statusesFor('mixmag');
    expect(s.map((x) => x.label)).toEqual([
      'IDEA', 'BORRADOR', 'EN CURSO', 'CORRECCIONES', 'MAQUETACIÓN',
      'PENDIENTE DE APROBACIÓN', 'APROBADO', 'PROGRAMADO', 'PUBLICADO',
    ]);
    const maq = s.find((x) => x.label === 'MAQUETACIÓN')!;
    expect(maq.teamsOnly).toEqual(['revista']);
    expect(statusesForTeam('mixmag', 'redes').map((x) => x.label)).not.toContain('MAQUETACIÓN');
    expect(statusesForTeam('mixmag', 'revista').map((x) => x.label)).toContain('MAQUETACIÓN');
  });

  it('TAGMAG tiene los 6 estados del flujo robot', () => {
    expect(statusesFor('tagmag').map((x) => x.label)).toEqual([
      'PENDIENTE DE REVISIÓN', 'APROBADO (A ESCRIBIR)', 'BORRADOR',
      'CORRECCIONES', 'PROGRAMADO', 'PUBLICADO',
    ]);
    // TAGMAG no siembra piezas
    expect(piecesFor('tagmag')).toEqual([]);
  });

  it('Mixmag siembra 6 piezas con recuentos por equipo 2/2/2', () => {
    const p = piecesFor('mixmag');
    expect(p).toHaveLength(6);
    expect(teamCounts(p)).toEqual({ todos: 6, redes: 2, web: 2, revista: 2 });
    const soho = p.find((x) => x.title === 'Artículo Soho Farmhouse Ibiza')!;
    expect(soho.campaignId).toBeUndefined(); // orgánico
    expect(soho.ownerInitials).toBeTruthy();  // tiene avatar
  });

  it('countByStatus: IDEA 2, BORRADOR 3, EN CURSO 1', () => {
    const p = piecesFor('mixmag');
    const c = countByStatus(p, statusesFor('mixmag'));
    const byLabel = (label: string) => c[statusesFor('mixmag').find((s) => s.label === label)!.id];
    expect(byLabel('IDEA')).toBe(2);
    expect(byLabel('BORRADOR')).toBe(3);
    expect(byLabel('EN CURSO')).toBe(1);
  });

  it('filterPieces compone query/mine/scope/team/status', () => {
    const p = piecesFor('mixmag');
    expect(filterPieces(p, { query: 'soho' })).toHaveLength(1);
    expect(filterPieces(p, { scope: 'organico' })).toHaveLength(1);
    expect(filterPieces(p, { scope: 'campana' })).toHaveLength(5);
    expect(filterPieces(p, { team: 'revista' })).toHaveLength(2);
    const idea = statusesFor('mixmag').find((s) => s.label === 'IDEA')!.id;
    expect(filterPieces(p, { statusId: idea })).toHaveLength(2);
    // inmutable
    expect(filterPieces(p, {})).not.toBe(p);
  });

  it('groupByTeam agrupa en orden redes, web, revista', () => {
    const g = groupByTeam(piecesFor('mixmag'));
    expect(Object.keys(g)).toEqual(['redes', 'web', 'revista']);
    expect(g.redes).toHaveLength(2);
  });

  it('TEAMS y STATUSES poblados (uso bajo noUnusedLocals)', () => {
    expect(TEAMS.map((t) => t.id)).toEqual(['redes', 'web', 'revista']);
    expect(STATUSES.length).toBe(15); // 9 mixmag + 6 tagmag
    expect(pieces.length).toBe(6);
  });
});
