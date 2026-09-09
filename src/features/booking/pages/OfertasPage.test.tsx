import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OfertasPage } from './OfertasPage';

describe('OfertasPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<OfertasPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Ofertas entrantes' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Propuestas recibidas desde el formulario público de la web.')
    ).toBeInTheDocument();
  });

  it('muestra los cinco filtros con sus contadores a 0', () => {
    render(<OfertasPage />);
    for (const label of [
      'Todas (0)',
      'Nuevas (0)',
      'Revisadas (0)',
      'Convertidas (0)',
      'Descartadas (0)',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
  });

  it('entra con Nuevas marcado', () => {
    render(<OfertasPage />);
    expect(screen.getByRole('button', { name: 'Nuevas (0)' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Todas (0)' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('el filtro es funcional: al pulsar otro pasa a estar marcado', async () => {
    const user = userEvent.setup();
    render(<OfertasPage />);
    await user.click(screen.getByRole('button', { name: 'Descartadas (0)' }));
    expect(screen.getByRole('button', { name: 'Descartadas (0)' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Nuevas (0)' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('el chip activo va sin borde y el inactivo con él, como el live', () => {
    render(<OfertasPage />);
    const activo = screen.getByRole('button', { name: 'Nuevas (0)' });
    expect(activo).toHaveClass('bg-slate-800', 'text-white', 'text-xs', 'py-1');
    expect(activo).not.toHaveClass('border');
    const inactivo = screen.getByRole('button', { name: 'Todas (0)' });
    expect(inactivo).toHaveClass('border', 'border-slate-200', 'bg-white', 'text-slate-600');
  });

  it('la cabecera es la del live: text-xl y font-bold, no la de las demás pantallas', () => {
    render(<OfertasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ofertas entrantes' })).toHaveClass(
      'text-xl',
      'font-bold',
      'text-slate-900'
    );
  });

  it('bandeja vacía: aviso a la izquierda y panel de selección a la derecha', () => {
    render(<OfertasPage />);
    expect(screen.getByText('No hay ofertas aquí.')).toHaveClass(
      'py-10',
      'text-sm',
      'text-slate-400'
    );
    expect(screen.getByText('Selecciona una oferta')).toHaveClass(
      'h-40',
      'place-items-center',
      'border-dashed'
    );
  });
});
