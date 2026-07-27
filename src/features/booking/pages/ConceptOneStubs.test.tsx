import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';

describe('ConceptOneShell (tabs planas)', () => {
  it('muestra las 5 tabs del live y ninguna de las viejas', () => {
    render(<MemoryRouter initialEntries={['/conceptone']}><ConceptOneShell /></MemoryRouter>);
    for (const t of ['Dashboard', 'Shows', 'Calendario', 'Disponibilidad', 'Contactos']) {
      expect(screen.getByRole('link', { name: t })).toBeInTheDocument();
    }
    expect(screen.queryByRole('link', { name: 'Logística' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Artistas' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Analítica' })).not.toBeInTheDocument();
  });

  it('los hrefs son rutas planas', () => {
    render(<MemoryRouter initialEntries={['/conceptone']}><ConceptOneShell /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Shows' })).toHaveAttribute('href', '/shows');
    expect(screen.getByRole('link', { name: 'Calendario' })).toHaveAttribute('href', '/calendario-c1');
    expect(screen.getByRole('link', { name: 'Disponibilidad' })).toHaveAttribute('href', '/disponibilidad');
    expect(screen.getByRole('link', { name: 'Contactos' })).toHaveAttribute('href', '/contactos');
  });
});
