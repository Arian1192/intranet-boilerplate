import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { ContenidosPage } from './ContenidosPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderPage(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<ContenidosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ContenidosPage', () => {
  it('Mixmag Panel: 3 grupos con piezas y MAQUETACIÓN solo en revista', () => {
    renderPage(MIXMAG);
    expect(screen.getByText('REDES')).toBeInTheDocument();
    expect(screen.getByText('WEB')).toBeInTheDocument();
    expect(screen.getByText('REVISTA')).toBeInTheDocument();
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    // MAQUETACIÓN aparece una vez (solo revista)
    expect(screen.getAllByText('MAQUETACIÓN')).toHaveLength(1);
  });

  it('cambia a Kanban y muestra tabs de equipo + columnas', async () => {
    renderPage(MIXMAG);
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(screen.getByRole('button', { name: /Todos/ })).toBeInTheDocument();
    // columna IDEA con contador 2
    expect(screen.getByText('IDEA')).toBeInTheDocument();
  });

  it('la búsqueda filtra las piezas visibles', async () => {
    renderPage(MIXMAG);
    await userEvent.type(screen.getByPlaceholderText(/Buscar por título o texto/), 'soho');
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    expect(screen.queryByText('Campaña Test 1 · Story')).toBeNull();
  });

  it('TAGMAG muestra empty-states en Panel (flujo robot, sin piezas)', () => {
    renderPage(TAGMAG);
    expect(screen.getAllByText('Nada pendiente en este canal.')).toHaveLength(3);
    // el estado aparece como StatusBox en cada uno de los 3 equipos
    expect(screen.getAllByText('PENDIENTE DE REVISIÓN')).toHaveLength(3);
  });

  it('no usa clases brand-* (delta gris del live)', () => {
    const { container } = renderPage(MIXMAG);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
