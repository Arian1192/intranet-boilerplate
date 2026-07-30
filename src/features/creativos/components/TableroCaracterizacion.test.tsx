import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesKanban } from './PiecesKanban';
import { PieceCard } from './PieceCard';
import { PiecesTable } from './PiecesTable';
import type { CreativePiece } from '../data/seed';
import { pieces } from '../data/seed';

/**
 * RED DE CARACTERIZACIÓN del tablero de /creativos.
 *
 * Existe para la extracción del tablero compartido creativos ↔ euphoric. `/creativos` es la
 * versión FIEL al live y la referencia de la convergencia, así que no puede cambiar ni un píxel
 * al extraerse. Los tests que ya había cubren el comportamiento y los colores; estos fijan lo que
 * nadie fijaba y es justo lo que una extracción rompe en silencio: las clases de estructura, el
 * orden de las columnas y la maquetación interna de la tarjeta y de la tabla.
 *
 * No comprueban que el live sea así — de eso ya responden `PieceCard.test.tsx` y compañía contra
 * `docs/references/creativos/live-2026-07-27-*`. Comprueban que lo que hay hoy siga igual mañana.
 */

/** Cubre los 5 estados: el seed real solo trae 3 y deja Revisión y Cambios vacíos. */
const cincoEstados: CreativePiece[] = [
  {
    id: 'c1', assignee: 'Alba', title: 'Video Pomo 26/07', client: 'SIGHT', type: 'Vídeo',
    version: 'v1', priority: 'Alta', deadline: '23 jul 2026', status: 'Briefing',
    checklist: { done: 0, total: 1 }, isOverdue: true, icon: '🎬',
  },
  {
    id: 'c2', assignee: 'Carlos', title: 'Pack Sold Out', client: 'SIGHT', type: 'Estático',
    version: 'v1', priority: 'Media', deadline: '10 jul 2026', status: 'En producción',
    checklist: { done: 0, total: 3 }, isOverdue: true,
  },
  {
    id: 'c3', assignee: 'Maf', title: 'Set Times SIGHT', client: 'SIGHT', type: 'Estático',
    version: 'v2', priority: 'Baja', deadline: '04 ago 2026', status: 'Revisión',
  },
  {
    id: 'c4', assignee: 'Alba', title: 'Flyer James Hype', client: 'SIGHT', type: 'Estático',
    version: 'v1', priority: 'Media', deadline: '28 jul 2026', status: 'Cambios',
  },
  {
    id: 'c5', assignee: 'Carlos', title: 'Flyer Claptone 02/08', client: 'SIGHT', type: 'Vídeo',
    version: 'v1', priority: 'Media', deadline: '22 jul 2026', status: 'Aprobado',
    checklist: { done: 2, total: 3 },
  },
];

describe('caracterización · PiecesKanban', () => {
  it('mantiene la rejilla de 2 → 3 → 5 columnas con gap-3', () => {
    const { container } = render(<PiecesKanban pieces={cincoEstados} />);
    expect(container.firstElementChild).toHaveClass(
      'grid', 'grid-cols-2', 'gap-3', 'sm:grid-cols-3', 'xl:grid-cols-5'
    );
  });

  it('mantiene las 5 columnas en el orden del live', () => {
    const { container } = render(<PiecesKanban pieces={cincoEstados} />);
    const titulos = [...container.firstElementChild!.children].map(
      (col) => col.querySelector('span')!.textContent
    );
    expect(titulos).toEqual(['Briefing', 'En producción', 'Revisión', 'Cambios', 'Aprobado']);
  });

  it('mantiene el color del badge de Revisión, que ningún test cubría', () => {
    render(<PiecesKanban pieces={cincoEstados} />);
    expect(screen.getByText('Revisión')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('mantiene la cabecera de columna y la tipografía del contador', () => {
    const { container } = render(<PiecesKanban pieces={cincoEstados} />);
    const cabecera = container.firstElementChild!.firstElementChild!.firstElementChild!;
    expect(cabecera).toHaveClass('mb-2', 'flex', 'items-center', 'justify-between', 'px-1');
    expect(within(cabecera as HTMLElement).getByText('1')).toHaveClass(
      'text-xs', 'font-medium', 'text-slate-400'
    );
  });

  it('mantiene el hueco «—» y el espaciado de la lista', () => {
    const { container } = render(<PiecesKanban pieces={[]} />);
    expect(screen.getAllByText('—')).toHaveLength(5);
    expect(screen.getAllByText('—')[0]).toHaveClass('px-1', 'text-sm', 'text-slate-300');

    const { container: lleno } = render(<PiecesKanban pieces={cincoEstados} />);
    expect(lleno.querySelector('.space-y-2')).toBeInTheDocument();
    expect(container).toBeTruthy();
  });
});

describe('caracterización · PieceCard', () => {
  const piece = cincoEstados[0];

  it('mantiene la píldora del responsable con su inicial', () => {
    render(<PieceCard piece={piece} />);
    const nombre = screen.getByText('Alba');
    expect(nombre).toHaveClass('text-[11px]', 'font-medium', 'text-slate-600');
    const pildora = nombre.parentElement!;
    expect(pildora).toHaveClass(
      'inline-flex', 'items-center', 'gap-1.5', 'rounded-full', 'bg-slate-100',
      'py-0.5', 'pl-0.5', 'pr-2'
    );
    // La inicial es un span aparte, no un <Avatar>.
    expect(within(pildora).getByText('A')).toHaveClass(
      'h-4', 'w-4', 'rounded-full', 'bg-slate-200', 'text-[9px]'
    );
  });

  it('mantiene la tipografía del título y de la línea de meta, ambas truncadas', () => {
    render(<PieceCard piece={piece} />);
    expect(screen.getByText('Video Pomo 26/07')).toHaveClass(
      'mt-1', 'truncate', 'text-sm', 'font-medium', 'text-slate-800'
    );
    expect(screen.getByText('SIGHT · Vídeo · v1')).toHaveClass(
      'mt-0.5', 'truncate', 'text-xs', 'text-slate-400'
    );
  });

  it('mantiene la tipografía del checklist', () => {
    render(<PieceCard piece={piece} />);
    expect(screen.getByText(/0\/1/)).toHaveClass('text-[10px]', 'text-slate-500');
  });

  it('no pinta la aprobación de cliente en la tarjeta', () => {
    // OJO: caracterización del estado ACTUAL, no una afirmación de fidelidad. El volcado del
    // 27-jul no traía ninguna creatividad con aprobación, así que esto está SIN VERIFICAR contra
    // el live. La captura fresca de recon debe resolverlo; si el live sí la pinta, este test cae.
    render(<PieceCard piece={{ ...piece, clientApproval: 'Pendiente cliente' }} />);
    expect(screen.queryByText('Pendiente cliente')).not.toBeInTheDocument();
  });
});

describe('caracterización · PiecesTable', () => {
  it('mantiene el marco de la tabla', () => {
    const { container } = render(<PiecesTable pieces={cincoEstados} />);
    expect(container.firstElementChild).toHaveClass(
      'overflow-hidden', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'shadow-sm'
    );
  });

  it('mantiene las clases de cabecera y de celda', () => {
    render(<PiecesTable pieces={cincoEstados} />);
    expect(screen.getByRole('columnheader', { name: 'CREATIVIDAD' })).toHaveClass(
      'px-4', 'py-2', 'font-medium'
    );
    expect(screen.getAllByRole('columnheader')[0].parentElement).toHaveClass(
      'border-b', 'border-slate-200', 'text-left', 'text-xs', 'uppercase',
      'tracking-wide', 'text-slate-400'
    );
    const fila = screen.getByText('Flyer Claptone 02/08').closest('tr')!;
    expect(fila).toHaveClass('border-b', 'border-slate-100', 'last:border-0', 'hover:bg-slate-50');
  });

  it('mantiene el título y la versión como dos spans de distinto color', () => {
    render(<PiecesTable pieces={cincoEstados} />);
    const titulo = screen.getByText('Flyer Claptone 02/08');
    expect(titulo).toHaveClass('text-slate-800');
    expect(within(titulo.closest('td')!).getByText('v1')).toHaveClass('text-slate-400');
  });

  it('mantiene una fila por creatividad, sin cabecera de más', () => {
    render(<PiecesTable pieces={cincoEstados} />);
    expect(screen.getAllByRole('row')).toHaveLength(cincoEstados.length + 1);
  });
});

describe('caracterización · el seed real no se mueve', () => {
  it('las 3 creatividades del seed caen en sus 3 columnas y dejan 2 vacías', () => {
    render(<PiecesKanban pieces={pieces} />);
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
