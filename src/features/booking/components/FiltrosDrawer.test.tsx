import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FiltrosDrawer, type ShowsFiltros } from './FiltrosDrawer';

const vacios: ShowsFiltros = { etapa: '', fase: '', pago: '', artista: '' };

describe('FiltrosDrawer', () => {
  it('no renderiza nada cuando está cerrado', () => {
    const { container } = render(
      <FiltrosDrawer abierto={false} filtros={vacios} onChange={() => {}} onClose={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra los 4 selects con sus opciones exactas y emite onChange', () => {
    const onChange = vi.fn();
    render(<FiltrosDrawer abierto filtros={vacios} onChange={onChange} onClose={() => {}} />);

    expect(screen.getByLabelText('Etapa')).toBeInTheDocument();
    expect(screen.getByLabelText('Fase')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado de pago')).toBeInTheDocument();
    expect(screen.getByLabelText('Artista')).toBeInTheDocument();

    // Opciones exactas de Fase, remedidas en el live el 2026-09-09: la que
    // decíamos «Liquidado» allí es «Cerrado». Mismo renombrado que la etapa.
    const fase = screen.getByLabelText('Fase');
    expect(Array.from(fase.querySelectorAll('option')).map((o) => o.textContent)).toEqual([
      'Todas las fases',
      'Tentative',
      'Confirmado',
      'Contrato',
      'Pagos',
      'Liquidación',
      'Cerrado',
      'Cancelado',
    ]);
    // Y la etapa, que ahora deriva de `etapaLabels` en vez de tener copia propia.
    const etapa = screen.getByLabelText('Etapa');
    expect(Array.from(etapa.querySelectorAll('option')).map((o) => o.textContent)).toEqual([
      'Todas las etapas',
      'Tentative',
      'Confirmado',
      'Contrato',
      'Pendiente cobro',
      'Pendiente liquidar',
      'Cerrado',
    ]);
    // artistas del recon
    expect(screen.getByRole('option', { name: 'Los Canarios' })).toBeInTheDocument();

    fireEvent.change(fase, { target: { value: 'liquidado' } });
    expect(onChange).toHaveBeenCalledWith({ ...vacios, fase: 'liquidado' });
  });
});
