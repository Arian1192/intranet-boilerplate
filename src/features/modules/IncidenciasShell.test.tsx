import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { IncidenciasShell } from './IncidenciasShell';

describe('IncidenciasShell', () => {
  it('renderiza IncidenciasPage dentro del AppLayout', () => {
    render(
      <MemoryRouter>
        <IncidenciasShell />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Incidencias' })).toBeInTheDocument();
    const stats = within(screen.getByRole('group', { name: 'Filtrar por estado' }));
    expect(stats.getByRole('button', { name: /NUEVAS/ })).toBeInTheDocument();
  });
});
