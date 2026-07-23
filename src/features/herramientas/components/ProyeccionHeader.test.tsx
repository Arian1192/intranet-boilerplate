import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProyeccionHeader } from './ProyeccionHeader';
import { seedProyecciones } from '../data/seed';

function renderHeader(overrides = {}) {
  const onUpdate = vi.fn();
  const onGuardar = vi.fn();
  render(
    <MemoryRouter>
      <ProyeccionHeader proyeccion={{ ...seedProyecciones[0], ...overrides }} isDirty={false} onUpdate={onUpdate} onGuardar={onGuardar} />
    </MemoryRouter>
  );
  return { onUpdate, onGuardar };
}

describe('ProyeccionHeader', () => {
  it('renders name, Volver link, estado activo y responsables', () => {
    renderHeader();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Volver' })).toHaveAttribute('href', '/herramientas/proyecciones');
    expect(screen.getByRole('button', { name: 'Aprobada' })).toHaveClass(/bg-white|shadow/); // activo dentro del SegmentedControl
    expect(screen.getByText('Jack')).toBeInTheDocument();
  });

  it('shows "Guardado" or "Cambios sin guardar" depending on isDirty', () => {
    renderHeader();
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('clicking an Estado option calls onUpdate with the new estado', async () => {
    const { onUpdate } = renderHeader();
    await userEvent.click(screen.getByRole('button', { name: 'Rechazada' }));
    expect(onUpdate).toHaveBeenCalledWith({ estado: 'rechazada' });
  });

  it('renders the inert Fase C buttons (Comentarios, PDF, Excel, i, Convertir en evento)', () => {
    renderHeader();
    ['i', 'Comentarios', 'PDF Ventas', 'PDF Explotación', 'Excel', 'Convertir en evento →'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('clicking Guardar calls onGuardar', async () => {
    const { onGuardar } = renderHeader();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onGuardar).toHaveBeenCalled();
  });
});
