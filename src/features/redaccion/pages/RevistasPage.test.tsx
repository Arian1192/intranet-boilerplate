import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router';
import { RevistasPage } from './RevistasPage';
import { MIXMAG, TAGMAG } from '../data/seed';
import type { Magazine } from '../data/types';

function renderWithMagazine(magazine: Magazine) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={<RevistasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('RevistasPage', () => {
  it('muestra el header, el botón y la edición (Mixmag)', () => {
    renderWithMagazine(MIXMAG);
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edición/ })).toBeInTheDocument();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
    expect(screen.queryByText('Ninguna edición todavía.')).toBeNull();
  });

  it('muestra el empty-state cuando no hay ediciones (TAGMAG)', () => {
    renderWithMagazine(TAGMAG);
    expect(screen.getByText('Ninguna edición todavía.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edición/ })).toBeInTheDocument();
  });
});
