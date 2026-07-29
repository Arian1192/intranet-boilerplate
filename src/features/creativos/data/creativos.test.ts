import { describe, it, expect } from 'vitest';
import { pieces, CURRENT_USER } from './seed';
import { filterPieces, groupByStatus, deriveStats, STATUS_COLUMNS, FILTERS } from './creativos';

describe('creativos helpers', () => {
  it('exposes the 7 filters and 5 status columns in order', () => {
    expect(FILTERS).toEqual(['Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas']);
    expect(STATUS_COLUMNS).toEqual(['Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado']);
  });

  it('seeds the 3 creatividades of the live in the table order of the live', () => {
    expect(pieces.map((p) => p.title)).toEqual([
      'Pack Sold Out · Pack Sold Out',
      'Video Pomo 26/07',
      'Flyer Claptone 02/08',
    ]);
    expect(pieces.map((p) => p.clientApproval)).toEqual([undefined, undefined, undefined]);
  });

  it('filterPieces: Todas returns all; Vídeo keeps only video; Diseño excludes video', () => {
    expect(filterPieces(pieces, 'Todas', CURRENT_USER)).toHaveLength(3);
    expect(filterPieces(pieces, 'Vídeo', CURRENT_USER).map((p) => p.id)).toEqual(['p1', 'p3']);
    expect(filterPieces(pieces, 'Diseño', CURRENT_USER).map((p) => p.id)).toEqual(['p2']);
  });

  it('filterPieces: Atrasadas excludes the approved one; Mías keeps Carlos', () => {
    expect(filterPieces(pieces, 'Atrasadas', CURRENT_USER).map((p) => p.id)).toEqual(['p2', 'p1']);
    expect(filterPieces(pieces, 'Mías', CURRENT_USER).map((p) => p.id)).toEqual(['p2', 'p3']);
    expect(filterPieces(pieces, 'Pend. aprobar', CURRENT_USER)).toHaveLength(0);
    expect(filterPieces(pieces, 'Correcciones', CURRENT_USER)).toHaveLength(0);
  });

  it('groupByStatus reproduces the live column counts', () => {
    const g = groupByStatus(pieces);
    expect(g['Briefing'].map((p) => p.id)).toEqual(['p1']);
    expect(g['En producción'].map((p) => p.id)).toEqual(['p2']);
    expect(g['Revisión']).toEqual([]);
    expect(g['Cambios']).toEqual([]);
    expect(g['Aprobado'].map((p) => p.id)).toEqual(['p3']);
  });

  it('deriveStats matches the live counts (2 / 0 / 0 / 2)', () => {
    expect(deriveStats(pieces)).toEqual({ activas: 2, pendAprobar: 0, correcciones: 0, atrasadas: 2 });
  });
});
