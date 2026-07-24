import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ProyeccionesProvider } from '../data/proyecciones-context';
import { ProyeccionDetailPage } from './ProyeccionDetailPage';
import { seedProyecciones } from '../data/seed';

function renderDetail(id = seedProyecciones[0].id) {
  return render(
    <MemoryRouter initialEntries={[`/herramientas/proyecciones/${id}`]}>
      <ProyeccionesProvider>
        <Routes>
          <Route path="/herramientas/proyecciones/:id" element={<ProyeccionDetailPage />} />
        </Routes>
      </ProyeccionesProvider>
    </MemoryRouter>
  );
}

describe('ProyeccionDetailPage', () => {
  it('renders the header and the Acuerdo tab by default', () => {
    renderDetail();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
  });

  it('switching to Previsión shows the Fase B tab; Real shows the Fase C real tab', async () => {
    renderDetail();
    await userEvent.click(screen.getByRole('button', { name: 'Previsión' }));
    expect(screen.getByRole('heading', { name: 'Ticketing' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Real' }));
    expect(screen.getByText('Asistencia real')).toBeInTheDocument();
    expect(screen.queryByText(/Esta vista se construye/)).not.toBeInTheDocument();
  });

  it('editing the header marks it dirty, and Guardar clears it', async () => {
    renderDetail();
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Rechazada' }));
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('shows "Proyección no encontrada" for an unknown id', () => {
    renderDetail('id-inexistente');
    expect(screen.getByText('Proyección no encontrada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a la lista' })).toHaveAttribute('href', '/herramientas/proyecciones');
  });
});
