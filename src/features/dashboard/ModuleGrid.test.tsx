import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ModuleGrid } from './ModuleGrid';
import type { Module } from '@/types';

const mods: Module[] = [
  { id: 'conceptone', slug: 'conceptone', name: 'ConceptOne', shortDescription: 'DESC-DABADEE', icon: 'Headphones', category: 'workspace', accent: '#773C9F' },
  { id: 'cruda', slug: 'cruda', name: 'CRUDA', shortDescription: '', icon: 'Shirt', category: 'workspace', accent: '#171717' },
];

describe('ModuleGrid', () => {
  it('renderiza la etiqueta del grupo y una pill por módulo con href', () => {
    render(
      <MemoryRouter>
        <ModuleGrid title="Espacios de trabajo" modules={mods} />
      </MemoryRouter>
    );
    expect(screen.getByText('Espacios de trabajo')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /ConceptOne/ });
    expect(link).toHaveAttribute('href', '/conceptone');
  });

  it('la pill lleva el badge del icono con el acento a 8%, tamaño de pill (no tarjeta) y sin descripción', () => {
    const { container } = render(
      <MemoryRouter>
        <ModuleGrid title="X" modules={mods} />
      </MemoryRouter>
    );
    const badge = container.querySelector('span[style*="background-color"]') as HTMLElement;
    expect(badge.getAttribute('style')).toContain('rgba(119, 60, 159, 0.08)');
    expect(container.querySelector('span.h-7.w-7')).toBeInTheDocument();
    expect(screen.queryByText('DESC-DABADEE')).toBeNull();
  });
});
