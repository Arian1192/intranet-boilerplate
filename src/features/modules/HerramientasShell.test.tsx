import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { HerramientasShell } from './HerramientasShell';

function renderShell(initialEntry = '/herramientas') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/herramientas" element={<HerramientasShell />}>
          <Route index element={<div data-testid="resumen-page">Resumen</div>} />
          <Route path="proyecciones" element={<div data-testid="proyecciones-page">Proyecciones</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('HerramientasShell', () => {
  it('renders module tabs', () => {
    renderShell();
    expect(screen.getByRole('link', { name: 'Herramientas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proyecciones' })).toBeInTheDocument();
  });

  it('renders the outlet child', () => {
    renderShell('/herramientas/proyecciones');
    expect(screen.getByTestId('proyecciones-page')).toBeInTheDocument();
  });
});
