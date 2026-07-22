import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { CampanasPage } from './CampanasPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderPage(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<CampanasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('CampanasPage', () => {
  it('Embudo Mixmag: stats, 6 cajas de etapa, fila de campaña', () => {
    renderPage(MIXMAG);
    expect(screen.getByText('En el aire')).toBeInTheDocument();
    // ganado 1.500,00 € aparece (toolbar). ACEPTADA como caja y como chip de fila.
    expect(screen.getAllByText('ACEPTADA').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText('COMPLETADA')).toBeInTheDocument(); // caja de etapa vacía
  });

  it('cambia a Kanban: columna ACEPTADA con tarjeta', async () => {
    renderPage(MIXMAG);
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    // hay 6 columnas (5 colapsadas + ACEPTADA expandida); localizamos la expandida
    const cols = screen.getAllByTestId('campana-column');
    expect(cols).toHaveLength(6);
    const expanded = cols.find((c) => c.getAttribute('data-collapsed') === 'false')!;
    expect(within(expanded).getByText('Campaña Test 1')).toBeInTheDocument();
  });

  it('la búsqueda filtra las campañas visibles', async () => {
    renderPage(MIXMAG);
    await userEvent.type(screen.getByPlaceholderText(/Buscar campaña o anuncian/), 'zzz');
    expect(screen.queryByText('Campaña Test 1')).toBeNull();
  });

  it('parametrización: TAGMAG también muestra su Campaña Test 1', () => {
    renderPage(TAGMAG);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
  });

  it('no usa clases brand-*', () => {
    const { container } = renderPage(MIXMAG);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
