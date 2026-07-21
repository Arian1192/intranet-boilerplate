import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { ModuleGrid } from './ModuleGrid';
import type { Module } from '@/types';

const modules: Module[] = [
  {
    id: 'conceptone',
    slug: 'conceptone',
    name: 'ConceptOne',
    shortDescription: 'Gestiona shows y su calculadora.',
    icon: 'Headphones',
    category: 'workspace',
    accent: '#773C9F',
  },
];

describe('ModuleGrid', () => {
  it('renders a link per module with name and description', () => {
    render(
      <MemoryRouter>
        <ModuleGrid modules={modules} title="Tus espacios" />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /ConceptOne/ });
    expect(link).toHaveAttribute('href', '/conceptone');
    expect(screen.getByText('Gestiona shows y su calculadora.')).toBeInTheDocument();
  });

  it('renders the icon chip tinted with the module accent at 8% alpha', () => {
    const { container } = render(
      <MemoryRouter>
        <ModuleGrid modules={modules} title="Tus espacios" />
      </MemoryRouter>
    );
    const chip = container.querySelector('span.h-10.w-10') as HTMLElement;
    expect(chip).not.toBeNull();
    expect(chip.style.backgroundColor).toBe('rgba(119, 60, 159, 0.08)');
  });
});
