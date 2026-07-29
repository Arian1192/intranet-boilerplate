import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, test, expect } from 'vitest';
import { EuphoricShell } from '@/features/modules/EuphoricShell';
import { ResumenPage } from './pages/ResumenPage';

function renderShell() {
  render(
    <MemoryRouter initialEntries={['/euphoric']}>
      <Routes>
        <Route path="/euphoric" element={<EuphoricShell />}>
          <Route index element={<ResumenPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('sub-nav de Euphoric (calco del live 2026-07-29)', () => {
  test('lista las 7 pestañas del live en orden', () => {
    renderShell();
    const nav = screen.getByRole('navigation', { name: 'Pestañas de Euphoric Media' });
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);
    expect(labels).toEqual([
      'Euphoric Media',
      'Cuentas',
      'Campañas',
      'Publicaciones',
      'Creatividades',
      'Eventos',
      'Agenda',
      'Negocio',
    ]);
  });

  test.each([
    ['Cuentas', '/euphoric/cuentas'],
    ['Campañas', '/euphoric/campanas'],
    ['Publicaciones', '/euphoric/calendario'],
    ['Creatividades', '/euphoric/piezas'],
    ['Eventos', '/euphoric/eventos'],
    ['Agenda', '/euphoric/agenda'],
    ['Negocio', '/euphoric/negocio'],
  ])('la pestaña %s apunta a %s (los paths no se renombran)', (label, href) => {
    renderShell();
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
  });

  test.each(['Resumen', 'Contenido', 'Piezas', 'Analítica'])(
    'ya no existe la pestaña %s',
    (label) => {
      renderShell();
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument();
    }
  );

  test('en la raíz /euphoric ninguna pestaña queda marcada como activa', () => {
    renderShell();
    const nav = screen.getByRole('navigation', { name: 'Pestañas de Euphoric Media' });
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(0);
  });

  test.each([
    ['Artistas', '/euphoric/artistas'],
    ['Ajustes', '/euphoric/ajustes'],
  ])('%s es una acción solo-icono a %s', (label, href) => {
    renderShell();
    const link = screen.getByRole('link', { name: label });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveTextContent('');
  });
});
