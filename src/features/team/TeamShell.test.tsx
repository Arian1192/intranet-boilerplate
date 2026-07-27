import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { TeamShell } from './TeamShell';

function renderShell(initialEntry = '/personal') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/personal" element={<TeamShell />}>
          <Route index element={<div data-testid="equipo-page">Equipo</div>} />
          <Route path="calendario" element={<div data-testid="calendario-page">Calendario</div>} />
          <Route path="fichas" element={<div data-testid="fichas-page">Fichas</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('TeamShell', () => {
  it('renders module tabs', () => {
    renderShell();
    expect(screen.getByRole('link', { name: 'Equipo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Calendario' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fichas' })).toBeInTheDocument();
  });

  it('renders the outlet child', () => {
    renderShell('/personal/calendario');
    expect(screen.getByTestId('calendario-page')).toBeInTheDocument();
  });
});
