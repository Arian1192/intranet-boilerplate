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
    checklist: { done: 0, total: 1 }, icon: '🎬', iconTitle: 'Vídeo',
  },
  {
    id: 'c2', assignee: 'Carlos', title: 'Pack Sold Out', client: 'SIGHT', type: 'Estático',
    version: 'v1', priority: 'Media', deadline: '10 jul 2026', status: 'En producción',
    checklist: { done: 0, total: 3 },
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

  it('mantiene la cabecera de columna y el contador en píldora', () => {
    const { container } = render(<PiecesKanban pieces={cincoEstados} />);
    const cabecera = container.firstElementChild!.firstElementChild!.firstElementChild!;
    expect(cabecera).toHaveClass('mb-2', 'flex', 'items-center', 'justify-between', 'px-1');
    // El contador del live es una píldora gris, no texto suelto.
    expect(within(cabecera as HTMLElement).getByText('1')).toHaveClass(
      'rounded-full', 'bg-slate-100', 'px-2', 'text-xs', 'text-slate-500'
    );
  });

  it('mantiene la zona de arrastre gris, visible también vacía', () => {
    const { container } = render(<PiecesKanban pieces={[]} />);
    expect(screen.getAllByText('—')).toHaveLength(5);
    expect(screen.getAllByText('—')[0]).toHaveClass(
      'px-1', 'py-3', 'text-center', 'text-xs', 'text-slate-300'
    );
    // La caja gris es el destino del drag: existe aunque la columna esté vacía.
    expect(container.querySelectorAll('.min-h-\\[80px\\].bg-slate-50')).toHaveLength(5);
  });
});

describe('caracterización · PieceCard', () => {
  const piece = cincoEstados[0];

  it('mantiene la píldora del responsable', () => {
    render(<PieceCard piece={piece} />);
    const nombre = screen.getByText('Alba');
    expect(nombre).toHaveClass('text-[11px]', 'font-medium', 'text-slate-600');
    const pildora = nombre.parentElement!;
    expect(pildora).toHaveClass(
      'flex', 'shrink-0', 'items-center', 'gap-1', 'rounded-full', 'bg-slate-100',
      'py-0.5', 'pl-0.5', 'pr-2'
    );
    // Sin `avatarUrl` cae a la inicial, a los 20px del avatar real del live.
    expect(within(pildora).getByText('A')).toHaveClass('h-5', 'w-5', 'rounded-full', 'bg-slate-200');
  });

  it('usa el avatar real cuando la pieza lo trae, con el nombre largo en el alt', () => {
    render(
      <PieceCard
        piece={{ ...piece, avatarUrl: 'https://ejemplo/av.jpg', assigneeFullName: 'Alba G' }}
      />
    );
    const img = screen.getByRole('img', { name: 'Alba G' });
    expect(img).toHaveClass('shrink-0', 'rounded-full', 'object-cover');
    expect(img).toHaveStyle({ width: '20px', height: '20px' });
    expect(screen.getByText('Alba')).toBeInTheDocument();
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

  it('mantiene el orden de la fila de badges: deadline, checklist y aprobación', () => {
    render(<PieceCard piece={{ ...piece, clientApproval: 'Pendiente cliente' }} />);
    const fila = screen.getByText('23 jul 2026').parentElement!;
    expect(fila).toHaveClass('mt-1.5', 'flex', 'flex-wrap', 'items-center', 'gap-1');
    expect([...fila.children].map((n) => n.textContent)).toEqual([
      '23 jul 2026', '☑ 0/1', 'Pendiente cliente',
    ]);
  });
});

describe('caracterización · PiecesTable', () => {
  it('mantiene el marco de la tabla y su scroll horizontal', () => {
    const { container } = render(<PiecesTable pieces={cincoEstados} />);
    expect(container.firstElementChild).toHaveClass('overflow-hidden', 'border-slate-200');
    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveClass('min-w-[880px]');
  });

  it('mantiene las clases de cabecera y de celda', () => {
    render(<PiecesTable pieces={cincoEstados} />);
    expect(screen.getByRole('columnheader', { name: 'Creatividad' })).toHaveClass(
      'px-4', 'py-2', 'font-medium'
    );
    expect(screen.getAllByRole('columnheader')[0].parentElement).toHaveClass(
      'border-b', 'border-slate-200', 'text-left', 'text-xs', 'uppercase',
      'tracking-wide', 'text-slate-400'
    );
    const fila = screen.getByText('Flyer Claptone 02/08').closest('tr')!;
    expect(fila).toHaveClass('cursor-pointer', 'hover:bg-slate-50');
    expect(fila.parentElement).toHaveClass('divide-y', 'divide-slate-100');
  });

  it('mantiene el título y la versión como dos spans de distinto color', () => {
    render(<PiecesTable pieces={cincoEstados} />);
    const celda = screen.getByText('Flyer Claptone 02/08').closest('td')!;
    expect(celda).toHaveClass('font-medium', 'text-slate-800');
    expect(within(celda).getByText('v1')).toHaveClass('text-xs', 'font-normal', 'text-slate-400');
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
