import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProyeccionToolbar } from './ProyeccionToolbar';
import { seedProyecciones } from '../data/seed';

function renderToolbar(props = {}) {
  const handlers = {
    onGuardar: vi.fn(),
    onToggleComentarios: vi.fn(),
    onToggleInfo: vi.fn(),
  };
  render(
    <MemoryRouter>
      <ProyeccionToolbar
        proyeccion={seedProyecciones[0]}
        isDirty={false}
        comentariosAbierto={false}
        infoAbierta={false}
        {...handlers}
        {...props}
      />
    </MemoryRouter>
  );
  return handlers;
}

describe('ProyeccionToolbar', () => {
  it('renders name, Volver, estado Guardado, i, Comentarios, exports y Guardar', () => {
    renderToolbar();
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Volver' })).toHaveAttribute('href', '/herramientas/proyecciones');
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    ['i', 'Comentarios', 'PDF Ventas', 'PDF Explotación', 'Excel', 'Guardar'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('Guardar / Comentarios / i disparan sus callbacks', async () => {
    const h = renderToolbar();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Comentarios' }));
    await userEvent.click(screen.getByRole('button', { name: 'i' }));
    expect(h.onGuardar).toHaveBeenCalled();
    expect(h.onToggleComentarios).toHaveBeenCalled();
    expect(h.onToggleInfo).toHaveBeenCalled();
  });

  it('los 3 exports son inertes (delta consciente D5): pulsarlos no hace nada ni muestra aviso', async () => {
    renderToolbar();
    for (const label of ['PDF Ventas', 'PDF Explotación', 'Excel']) {
      await userEvent.click(screen.getByRole('button', { name: label }));
    }
    expect(screen.queryByText(/Próximamente/i)).not.toBeInTheDocument();
  });

  it('muestra "Cambios sin guardar" cuando isDirty', () => {
    renderToolbar({ isDirty: true });
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
  });
});
