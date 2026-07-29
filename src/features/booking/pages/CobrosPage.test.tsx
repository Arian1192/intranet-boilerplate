import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CobrosPage } from './CobrosPage';

describe('CobrosPage', () => {
  it('calca cabecera, bajada y botón de facturar', () => {
    render(<CobrosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cobros' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lo que deben los promotores. Total y vencimientos salen del plan de pagos; lo cobrado, de las facturas conciliadas en Holded.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Facturar el mes…' })).toBeInTheDocument();
  });

  it('muestra los 4 KPIs con los valores del live', () => {
    render(<CobrosPage />);
    const tarjeta = screen.getByText('SHOWS POR COBRAR').parentElement!;
    expect(within(tarjeta).getByText('7')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTE TOTAL')).toBeInTheDocument();
    expect(screen.getByText('9631,60 €')).toBeInTheDocument();
    expect(screen.getByText('FUERA DE PLAZO')).toBeInTheDocument();
    expect(screen.getByText('6727,60 €')).toBeInTheDocument();
    expect(screen.getByText('5 show(s)')).toBeInTheDocument();
    expect(screen.getByText('VENCE ESTA SEMANA')).toBeInTheDocument();
    expect(screen.getByText('0 show(s)')).toBeInTheDocument();
  });

  it('el conmutador trae Por show 7 y Por factura 1', () => {
    render(<CobrosPage />);
    const grupo = screen.getByRole('group', { name: 'Agrupación de cobros' });
    expect(within(grupo).getByRole('button', { name: 'Por show 7' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(grupo).getByRole('button', { name: 'Por factura 1' })).toBeInTheDocument();
  });

  it('los filtros son Todos 7 y Vencidos 5', () => {
    render(<CobrosPage />);
    const grupo = screen.getByRole('group', { name: 'Filtro de cobros' });
    expect(within(grupo).getByRole('button', { name: 'Todos 7' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(grupo).getByRole('button', { name: 'Vencidos 5' })).toBeInTheDocument();
  });

  it('la tabla trae las 7 filas del live con sus columnas', () => {
    render(<CobrosPage />);
    for (const cabecera of [
      'Show',
      'ARTISTA',
      'TOTAL',
      'PAGADO',
      'Pendiente',
      'Vencimiento',
      'CLIENTE',
    ]) {
      expect(screen.getByRole('columnheader', { name: cabecera })).toBeInTheDocument();
    }
    const filas = screen.getAllByRole('row').slice(1);
    expect(filas).toHaveLength(7);
    expect(within(filas[0]).getByText('The Next')).toBeInTheDocument();
    expect(within(filas[0]).getByText('Pau Guilera')).toBeInTheDocument();
    expect(within(filas[0]).getByText('D+3')).toBeInTheDocument();
    expect(within(filas[0]).getByText('06 jul 2026')).toBeInTheDocument();
    expect(within(filas[0]).getByText('Vencido · 1016,40 €')).toBeInTheDocument();
    expect(within(filas[0]).getByText('Recaba Inversiones Turisticas, S.L.')).toBeInTheDocument();
    expect(within(filas[6]).getByText('Summer Opening Festival')).toBeInTheDocument();
    expect(within(filas[6]).getByText('Florentia')).toBeInTheDocument();
    expect(within(filas[6]).queryByText(/Vencido/)).toBeNull();
  });

  it('SANITY vence en septiembre y no lleva chapa de vencido', () => {
    render(<CobrosPage />);
    const fila = screen.getAllByRole('row').find((r) => within(r).queryByText('SANITY'))!;
    expect(within(fila).getByText('13 sept 2026')).toBeInTheDocument();
    expect(within(fila).queryByText(/Vencido/)).toBeNull();
  });

  it('el filtro Vencidos deja 5 filas', async () => {
    const user = userEvent.setup();
    render(<CobrosPage />);
    await user.click(screen.getByRole('button', { name: 'Vencidos 5' }));
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(5);
    expect(screen.queryByText('SANITY')).toBeNull();
  });

  it('el conmutador Por factura cambia la tabla a la única factura emitida', async () => {
    const user = userEvent.setup();
    render(<CobrosPage />);
    await user.click(screen.getByRole('button', { name: 'Por factura 1' }));
    expect(screen.getByRole('columnheader', { name: 'FACTURA' })).toBeInTheDocument();
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(1);
  });
});
