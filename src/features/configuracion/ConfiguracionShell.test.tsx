import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ConfiguracionShell } from './ConfiguracionShell';

function renderShell(path = '/configuracion') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/configuracion" element={<ConfiguracionShell />}>
          <Route index element={<h1>Plantillas de correo</h1>} />
          <Route path="uso" element={<h1>Uso del sistema</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ConfiguracionShell', () => {
  it('renderiza el sidebar y el outlet dentro del AppLayout', () => {
    renderShell();
    expect(screen.getByText('SISTEMA')).toBeInTheDocument();
    expect(screen.getByText('Festivos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Plantillas de correo' })).toBeInTheDocument();
  });

  it('mantiene el sidebar al navegar a una ruta hija', () => {
    renderShell('/configuracion/uso');
    expect(screen.getByText('Uso y coste').closest('a')).toHaveClass('bg-slate-100');
    expect(screen.getByRole('heading', { name: 'Uso del sistema' })).toBeInTheDocument();
  });
});
