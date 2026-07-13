import type { DocNode, DocVisibility } from './seed';

export interface TreeNode { doc: DocNode; children: TreeNode[] }
export interface TreeSection { key: DocVisibility; title: string; roots: TreeNode[] }

export const SECTIONS: { key: DocVisibility; title: string }[] = [
  { key: 'privado', title: 'PRIVADOS' },
  { key: 'compartido', title: 'COMPARTIDOS' },
  { key: 'equipo', title: 'TODO EL EQUIPO' },
];

export function findDoc(docs: DocNode[], id: string): DocNode | undefined {
  return docs.find((d) => d.id === id);
}

export function childrenOf(docs: DocNode[], parentId: string): DocNode[] {
  return docs.filter((d) => d.parentId === parentId);
}

function toTree(docs: DocNode[], parentId: string | null): TreeNode[] {
  const ids = new Set(docs.map((d) => d.id));
  return docs
    .filter((d) =>
      parentId === null
        // raíz = sin padre, o cuyo padre real no está en este subconjunto
        // (p.ej. filtrado por búsqueda, que rompe la cadena de ancestros)
        ? d.parentId === null || !ids.has(d.parentId)
        : d.parentId === parentId
    )
    .map((doc) => ({ doc, children: toTree(docs, doc.id) }));
}

export function buildTree(docs: DocNode[]): TreeSection[] {
  return SECTIONS.map(({ key, title }) => ({
    key,
    title,
    // raíces de la sección = docs de esa visibilidad sin padre
    roots: toTree(docs.filter((d) => d.visibility === key), null),
  }));
}

export function filterDocs(docs: DocNode[], query: string): DocNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return docs;
  return docs.filter((d) => d.title.toLowerCase().includes(q));
}

let seq = 0;
export function createDoc(visibility: DocVisibility, parentId: string | null = null): DocNode {
  seq += 1;
  return {
    id: `d-new-${seq}`,
    emoji: '📄',
    title: 'Sin título',
    visibility,
    parentId,
    content: [{ type: 'paragraph', content: '' }],
    updatedLabel: 'Nuevo',
  };
}
