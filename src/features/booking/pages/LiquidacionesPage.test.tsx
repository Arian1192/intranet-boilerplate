import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LiquidacionesPage } from './LiquidacionesPage';

describe('LiquidacionesPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<LiquidacionesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Liquidaciones' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Estado de dinero de cada show: cobros del promotor, gastos, y lo liquidado al artista.'
      )
    ).toBeInTheDocument();
  });

  it('pinta los tres KPI del live', () => {
    render(<LiquidacionesPage />);
    expect(screen.getByText('PENDIENTE DE COBRAR')).toBeInTheDocument();
    expect(screen.getByText('172.489,88 €')).toBeInTheDocument();
    expect(screen.getByText('GASTOS POR RECUPERAR')).toBeInTheDocument();
    expect(screen.getByText('1006,43 €')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTE DE LIQUIDAR')).toBeInTheDocument();
  });

  it('arranca en «Por show» con las 243 filas y las 9 columnas del live', () => {
    render(<LiquidacionesPage />);
    expect(screen.getByRole('button', { name: 'Por show' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByText('243 shows')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
      'SHOW',
      'FECHA',
      'COBRADO',
      'PEND. COBRAR',
      'A RECUPERAR',
      'NETO ARTISTA',
      'LIQUIDADO',
      'PEND. LIQUIDAR',
      'ESTADO',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(244); // 243 + la cabecera
  });

  it('la primera fila trae el artista, el código y el detalle apilados', () => {
    render(<LiquidacionesPage />);
    const fila = screen.getAllByRole('row')[1];
    expect(within(fila).getByText('Olivia Bass')).toBeInTheDocument();
    expect(within(fila).getByText('C1-2026-155')).toBeInTheDocument();
    expect(within(fila).getByText('OASIS · Oasis · Maspalomas')).toBeInTheDocument();
    expect(within(fila).getByText('24 dic 2026')).toBeInTheDocument();
    expect(within(fila).getByText('Sin liquidar')).toBeInTheDocument();
  });

  it('el conmutador lleva a «Por artista», que es otra tabla de 5 columnas', async () => {
    const user = userEvent.setup();
    render(<LiquidacionesPage />);
    await user.click(screen.getByRole('button', { name: 'Por artista' }));

    expect(screen.getByText('32 artistas')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
      'ARTISTA',
      'SHOWS',
      'PEND. LIQUIDAR',
      'DEUDA VIVA',
      'POSICIÓN NETA',
    ]);
    const primera = screen.getAllByRole('row')[1];
    expect(within(primera).getByText('Bizza')).toBeInTheDocument();
    expect(within(primera).getByText('60')).toBeInTheDocument();
    expect(within(primera).getByText('+29.245,97 €')).toBeInTheDocument();
  });

  it('el filtro de estado es un desplegable con las seis opciones del live', () => {
    render(<LiquidacionesPage />);
    const select = screen.getByRole('combobox', { name: 'Estado de la liquidación' });
    expect([...select.querySelectorAll('option')].map((o) => o.textContent)).toEqual([
      'Todos los estados',
      'Sin liquidar',
      'Parcialmente liquidado',
      'Pendiente liquidar',
      'Liquidado',
      'Incidencia',
    ]);
  });

  it('filtrar por estado recorta la tabla y el contador', async () => {
    const user = userEvent.setup();
    render(<LiquidacionesPage />);
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Estado de la liquidación' }),
      'Liquidado'
    );
    expect(screen.getByText('23 shows')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(24);
  });

  it('el buscador filtra por código', () => {
    render(<LiquidacionesPage />);
    // `fireEvent.change` en vez de `user.type`: la tabla tiene 243 filas y
    // teclear letra a letra la re-renderiza una vez por pulsación. Se comía los
    // 5 s de límite en cuanto la suite corría con carga, y fallaba de forma
    // intermitente. Lo que prueba el test —que el buscador filtra— no cambia.
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, show, código…'), {
      target: { value: 'C1-2026-155' },
    });
    expect(screen.getByText('1 show')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('los KPI se recalculan sobre lo filtrado', () => {
    render(<LiquidacionesPage />);
    // `fireEvent.change` en vez de `user.type`: la tabla tiene 243 filas y
    // teclear letra a letra la re-renderiza una vez por pulsación. Se comía los
    // 5 s de límite en cuanto la suite corría con carga, y fallaba de forma
    // intermitente. Lo que prueba el test —que el buscador filtra— no cambia.
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, show, código…'), {
      target: { value: 'C1-2026-155' },
    });
    const kpi = screen.getByText('PENDIENTE DE COBRAR').parentElement!;
    expect(within(kpi).getByText('960,00 €')).toBeInTheDocument();
  });

  it('avisa cuando la búsqueda no encuentra nada', () => {
    render(<LiquidacionesPage />);
    // `fireEvent.change` en vez de `user.type`: la tabla tiene 243 filas y
    // teclear letra a letra la re-renderiza una vez por pulsación. Se comía los
    // 5 s de límite en cuanto la suite corría con carga, y fallaba de forma
    // intermitente. Lo que prueba el test —que el buscador filtra— no cambia.
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, show, código…'), {
      target: { value: 'no-existe-este-show' },
    });
    expect(screen.getByText('Ningún show cuadra con el filtro.')).toBeInTheDocument();
  });
});
