import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { test, expect } from 'vitest';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { PedidosPage } from './pages/PedidosPage';

test('renders Pedidos/Catálogo tabs and an Analítica icon action', () => {
  render(
    <MemoryRouter initialEntries={['/cruda']}>
      <Routes>
        <Route path="/cruda" element={<CrudaShell />}>
          <Route index element={<PedidosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('href', '/cruda');
  expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/cruda/catalogo');
  expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute('href', '/cruda/analitica');
});
