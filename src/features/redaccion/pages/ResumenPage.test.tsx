import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { ResumenPage } from './ResumenPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderWithMagazine(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<ResumenPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ResumenPage', () => {
  it('muestra las 3 stat cards y la publicación (Mixmag)', () => {
    renderWithMagazine(MIXMAG);
    expect(screen.getByText('LO QUE LLEVAS TÚ')).toBeInTheDocument();
    expect(screen.getByText('ATRASADOS')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTES DE APROBAR')).toBeInTheDocument();
    expect(screen.getByText('Publicaciones')).toBeInTheDocument();
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByText('Revista abierta: Patrick Topping (Agosto 2026)')).toBeInTheDocument();
  });

  it('usa los datos de TAGMAG cuando ese es el context', () => {
    renderWithMagazine(TAGMAG);
    expect(screen.getByText('TAGMAG')).toBeInTheDocument();
    expect(screen.queryByText(/Revista abierta:/)).toBeNull();
  });
});
