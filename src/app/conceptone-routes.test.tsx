import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>
  );
}

describe('rutas de ConceptOne v2', () => {
  it.each([
    ['/ofertas', 'Ofertas entrantes'],
    ['/cobros', 'Cobros'],
    ['/gastos', 'Gastos'],
    ['/management/estrategias', 'Estrategias · Management'],
  ])('%s renderiza la pantalla %s dentro del shell', async (path, heading) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bookings' })).toBeInTheDocument();
  });
});
