import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OfertasPage } from './OfertasPage';

describe('OfertasPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<OfertasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ofertas entrantes' })).toBeInTheDocument();
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

  it('bandeja vacía: aviso a la izquierda y panel de selección a la derecha', () => {
    render(<OfertasPage />);
    expect(screen.getByText('No hay ofertas aquí.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una oferta')).toBeInTheDocument();
  });
});
