import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

afterEach(cleanup);

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>
  );
}

describe('rutas de Euphoric', () => {
  it('la raíz /euphoric es el Resumen (no hay pestaña propia)', () => {
    renderRoute('/euphoric');
    expect(screen.getByRole('heading', { level: 1, name: 'Euphoric Media' })).toBeInTheDocument();
  });

  it.each([
    ['/euphoric/cuentas', 'Cuentas'],
    ['/euphoric/artistas', 'Artistas'],
    ['/euphoric/agenda', 'Agenda · Euphoric'],
    ['/euphoric/ajustes', 'Ajustes · Euphoric Media'],
    ['/euphoric/negocio', 'Dirección · Euphoric'],
    ['/euphoric/negocio/pipeline', 'Pipeline · Euphoric'],
    ['/euphoric/negocio/presupuestos', 'Presupuestos'],
    ['/euphoric/negocio/analitica', 'Analítica'],
    ['/euphoric/negocio/tiempos', 'Tiempos'],
  ])('%s abre %s', (path, heading) => {
    renderRoute(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('la analítica ya no cuelga de /euphoric/analitica', () => {
    renderRoute('/euphoric/analitica');
    expect(screen.queryByRole('heading', { level: 1, name: 'Analítica' })).not.toBeInTheDocument();
  });

  it('Negocio tiene su propia sub-nav de 5 vistas', () => {
    renderRoute('/euphoric/negocio');
    const nav = screen.getByRole('navigation', { name: 'Vistas de Negocio' });
    expect(
      Array.from(nav.querySelectorAll('a')).map((link) => [link.textContent, link.getAttribute('href')])
    ).toEqual([
      ['Dirección', '/euphoric/negocio'],
      ['Pipeline', '/euphoric/negocio/pipeline'],
      ['Presupuestos', '/euphoric/negocio/presupuestos'],
      ['Analítica', '/euphoric/negocio/analitica'],
      ['Tiempos', '/euphoric/negocio/tiempos'],
    ]);
  });
});
