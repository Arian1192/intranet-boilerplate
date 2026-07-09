import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { test, expect } from 'vitest';
import { EuphoricShell } from '@/features/modules/EuphoricShell';
import { ResumenPage } from './pages/ResumenPage';

test('renders module tabs and Analítica icon', () => {
  render(
    <MemoryRouter initialEntries={['/euphoric']}>
      <Routes>
        <Route path="/euphoric" element={<EuphoricShell />}>
          <Route index element={<ResumenPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Campañas' })).toHaveAttribute('href', '/euphoric/campanas');
  expect(screen.getByRole('link', { name: 'Contenido' })).toHaveAttribute('href', '/euphoric/calendario');
  expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute('href', '/euphoric/analitica');
});
