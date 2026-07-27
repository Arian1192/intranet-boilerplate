import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProyeccionesProvider } from '../data/proyecciones-context';
import { ProyeccionesListPage } from './ProyeccionesListPage';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/herramientas/proyecciones']}>
      <ProyeccionesProvider>
        <Routes>
          <Route path="/herramientas/proyecciones" element={<ProyeccionesListPage />} />
          <Route path="/herramientas/proyecciones/:id" element={<div data-testid="detail">detalle</div>} />
        </Routes>
      </ProyeccionesProvider>
    </MemoryRouter>
  );
}

describe('ProyeccionesListPage', () => {
  it('renders the title, subtitle and the seeded row', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Cuenta de explotación de eventos' })).toBeInTheDocument();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
  });

  it('clicking "Nueva proyección" creates a draft and navigates to its detail', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'Nueva proyección' }));
    expect(screen.getByTestId('detail')).toBeInTheDocument();
  });

  it('deleting the only row shows the empty state', async () => {
    renderPage();
    // hover actions are always in the DOM (solo ocultas con CSS), así que el botón es clicable en jsdom
    await userEvent.click(screen.getByText('Borrar'));
    expect(screen.getByText('Todavía no hay proyecciones.')).toBeInTheDocument();
  });
});
