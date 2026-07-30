import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, expect } from 'vitest';
import { TeamShell } from '../TeamShell';
import { UsuariosPage } from './UsuariosPage';

/** Monta el trozo de router real de /personal para comprobar la ruta nueva. */
function montar(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/personal" element={<TeamShell />}>
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ruta /personal/usuarios', () => {
  it('resuelve y pinta la vista de Usuarios dentro del shell de Team', () => {
    montar('/personal/usuarios');
    expect(screen.getByRole('heading', { level: 1, name: 'Usuarios' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CONCEPTONE · NAVEGACIÓN' })).toBeInTheDocument();
  });

  it('la sub-nav de Team sigue siendo Equipo · Calendario · Fichas', () => {
    montar('/personal/usuarios');
    for (const [label, href] of [
      ['Equipo', '/personal'],
      ['Calendario', '/personal/calendario'],
      ['Fichas', '/personal/fichas'],
    ]) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
    // «Usuarios» no está en la sub-nav: al live solo se llega desde Configuración
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument();
  });
});
