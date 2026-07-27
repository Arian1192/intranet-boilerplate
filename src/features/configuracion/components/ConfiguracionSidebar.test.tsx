import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ConfiguracionSidebar } from './ConfiguracionSidebar';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/configuracion/*" element={<ConfiguracionSidebar />} />
        <Route path="/personal" element={<ConfiguracionSidebar />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ConfiguracionSidebar', () => {
  it('renderiza las 6 secciones y 12 ítems', () => {
    renderAt('/configuracion');
    ['SISTEMA', 'MI TRABAJO', 'COMUNICACIÓN', 'CONCEPTONE · BOOKING', 'PRODUCCIÓN', 'EQUIPO'].forEach((s) =>
      expect(screen.getByText(s)).toBeInTheDocument()
    );
    expect(screen.getByText('Uso y coste')).toBeInTheDocument();
    expect(screen.getByText('Festivos')).toBeInTheDocument();
  });

  it('resalta el ítem activo por ruta', () => {
    renderAt('/configuracion/uso');
    expect(screen.getByText('Uso y coste').closest('a')).toHaveClass('bg-slate-100');
    expect(screen.getByText('Incidencias').closest('a')).not.toHaveClass('bg-slate-100');
  });

  it('"Plantillas de correo" solo activo en la ruta índice exacta', () => {
    renderAt('/configuracion/uso');
    expect(screen.getByText('Plantillas de correo').closest('a')).not.toHaveClass('bg-slate-100');
  });

  it('"Cuentas (auditoría)" es un link de salida a /personal y nunca queda activo', () => {
    renderAt('/configuracion');
    const link = screen.getByText('Cuentas (auditoría)').closest('a')!;
    expect(link).toHaveAttribute('href', '/personal');
    expect(link).not.toHaveClass('bg-slate-100');
  });
});
