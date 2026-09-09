import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContratosPage } from './ContratosPage';
import { CONTRATOS_MANAGEMENT } from '@/features/booking/data/management-contratos';

describe('ContratosPage — calco del live', () => {
  it('pinta la cabecera y el botón de alta del live', () => {
    render(<ContratosPage />);
    expect(screen.getByRole('heading', { name: 'Contratos', level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ciclo de vida del contrato de cada artista: término, preaviso, alcance y comisión.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo contrato' })).toHaveClass('btn-primary');
  });

  it('los tres KPI salen de los datos y hoy valen 0, como en la captura', () => {
    render(<ContratosPage />);
    expect(CONTRATOS_MANAGEMENT).toHaveLength(0);
    for (const rotulo of ['Contratos activos', 'Preaviso próximo (≤90d)', 'Vencidos']) {
      const tarjeta = screen.getByText(rotulo).parentElement as HTMLElement;
      expect(within(tarjeta).getByText('0')).toBeInTheDocument();
    }
  });

  it('mantiene los tonos medidos en el volcado: preaviso ámbar y vencidos rosa', () => {
    render(<ContratosPage />);
    const preaviso = screen.getByText('Preaviso próximo (≤90d)').parentElement as HTMLElement;
    expect(within(preaviso).getByText('0')).toHaveClass('text-amber-600');
    const vencidos = screen.getByText('Vencidos').parentElement as HTMLElement;
    expect(within(vencidos).getByText('0')).toHaveClass('text-rose-600');
  });

  it('rotula las seis columnas de la tabla', () => {
    render(<ContratosPage />);
    const rotulos = screen.getAllByRole('columnheader').map((c) => c.textContent);
    expect(rotulos).toEqual(['Artista', 'Estado', 'Fin', 'Preaviso antes de', 'Alcance', 'Live %']);
  });

  it('sin contratos pinta el vacío literal del live, a seis columnas', () => {
    render(<ContratosPage />);
    const vacio = screen.getByText('Sin contratos. Crea el primero.');
    expect(vacio).toHaveAttribute('colspan', '6');
    expect(screen.getAllByRole('row')).toHaveLength(2); // cabecera + fila de vacío
  });
});
