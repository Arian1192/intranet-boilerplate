import { describe, it, expect } from 'vitest';
import { pieces, CURRENT_USER } from './seed';
import { filterPieces, groupByStatus, deriveStats, STATUS_COLUMNS, FILTERS } from './creativos';

describe('creativos helpers', () => {
  it('exposes the 7 filters and 5 status columns in order', () => {
    expect(FILTERS).toEqual(['Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas']);
    expect(STATUS_COLUMNS).toEqual(['Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado']);
  });

  it('filterPieces: Todas returns all; Vídeo keeps only video; Diseño excludes video', () => {
    expect(filterPieces(pieces, 'Todas', CURRENT_USER)).toHaveLength(3);
    expect(filterPieces(pieces, 'Vídeo', CURRENT_USER).map((p) => p.id)).toEqual(['p1']);
    expect(filterPieces(pieces, 'Diseño', CURRENT_USER).map((p) => p.id)).toEqual(['p2', 'p3']);
  });

  it('filterPieces: Atrasadas keeps overdue; Pend. aprobar keeps Revisión; Correcciones keeps Cambios', () => {
    expect(filterPieces(pieces, 'Atrasadas', CURRENT_USER).map((p) => p.id)).toEqual(['p3']);
    expect(filterPieces(pieces, 'Pend. aprobar', CURRENT_USER).map((p) => p.id)).toEqual(['p3']);
    expect(filterPieces(pieces, 'Correcciones', CURRENT_USER)).toHaveLength(0);
  });

  it('groupByStatus buckets pieces into every column', () => {
    const g = groupByStatus(pieces);
    expect(g['Briefing'].map((p) => p.id)).toEqual(['p1']);
    expect(g['En producción'].map((p) => p.id)).toEqual(['p2']);
    expect(g['Revisión'].map((p) => p.id)).toEqual(['p3']);
    expect(g['Cambios']).toEqual([]);
    expect(g['Aprobado']).toEqual([]);
  });

  it('deriveStats matches the live counts', () => {
    expect(deriveStats(pieces)).toEqual({ activas: 3, pendAprobar: 1, correcciones: 0, atrasadas: 1 });
  });
});
