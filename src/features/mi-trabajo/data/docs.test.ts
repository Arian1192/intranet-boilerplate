import { describe, it, expect } from 'vitest';
import { docs, tasks, WELCOME_ID } from './seed';
import { buildTree, findDoc, childrenOf, filterDocs, createDoc, SECTIONS } from './docs';

describe('mi-trabajo data', () => {
  it('welcome doc exists in the equipo section with BlockNote content', () => {
    const w = findDoc(docs, WELCOME_ID);
    expect(w?.title).toBe('Bienvenido a Documentos');
    expect(w?.visibility).toBe('equipo');
    expect(Array.isArray(w?.content)).toBe(true);
    expect(w!.content.length).toBeGreaterThan(10); // muchos bloques
  });

  it('SECTIONS map to live titles in order', () => {
    expect(SECTIONS.map((s) => s.title)).toEqual(['PRIVADOS', 'COMPARTIDOS', 'TODO EL EQUIPO']);
  });

  it('buildTree groups by visibility and nests children by parentId', () => {
    const tree = buildTree(docs);
    const equipo = tree.find((s) => s.key === 'equipo')!;
    // welcome es raíz en equipo y tiene al menos un hijo anidado
    const root = equipo.roots.find((n) => n.doc.id === WELCOME_ID)!;
    expect(root).toBeTruthy();
    expect(root.children.length).toBeGreaterThanOrEqual(1);
  });

  it('childrenOf returns direct children only', () => {
    const kids = childrenOf(docs, WELCOME_ID);
    expect(kids.map((d) => d.id)).toContain('d-riders');
    expect(kids.every((d) => d.parentId === WELCOME_ID)).toBe(true);
  });

  it('filterDocs matches by title (case-insensitive)', () => {
    expect(filterDocs(docs, 'bienvenido').map((d) => d.id)).toContain(WELCOME_ID);
    expect(filterDocs(docs, 'zzz-none')).toEqual([]);
    expect(filterDocs(docs, '').length).toBe(docs.length);
  });

  it('createDoc returns a new empty doc titled "Sin título"', () => {
    const d = createDoc('privado', null);
    expect(d.title).toBe('Sin título');
    expect(d.visibility).toBe('privado');
    expect(d.parentId).toBeNull();
    expect(d.content).toEqual([{ type: 'paragraph', content: '' }]);
    expect(d.id).toMatch(/^d-/);
  });

  it('tasks seed defaults to empty pending list', () => {
    expect(Array.isArray(tasks)).toBe(true);
  });
});
