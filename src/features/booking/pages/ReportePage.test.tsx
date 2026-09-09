import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ReportePage } from './ReportePage';

async function irA(pestana: string) {
  const user = userEvent.setup();
  render(<ReportePage />);
  await user.click(screen.getByRole('tab', { name: pestana }));
}

describe('ReportePage — cabecera y filtros', () => {
  it('calca el h1 y la bajada del live', () => {
    render(<ReportePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Analítica' })).toBeInTheDocument();
    expect(
      screen.getByText('Uso interno · fees, agentes y comisiones. Importes en EUR.')
    ).toBeInTheDocument();
  });

  it('el filtro Estado trae sus tres opciones', () => {
    render(<ReportePage />);
    const estado = screen.getByLabelText('Estado');
    expect(
      within(estado)
        .getAllByRole('option')
        .map((o) => o.textContent)
    ).toEqual(['Liquidados', 'Pendientes de liquidar', 'Todos']);
  });

  it('los dos selectores de fecha van cerrados, con el placeholder del live', () => {
    render(<ReportePage />);
    for (const nombre of ['Desde', 'Hasta']) {
      const boton = screen.getByRole('button', { name: nombre });
      expect(within(boton).getByText('dd/mm/aaaa')).toBeInTheDocument();
    }
  });

  it('los filtros sólo salen en Resumen, como en el live', async () => {
    const user = userEvent.setup();
    render(<ReportePage />);
    expect(screen.getByLabelText('Estado')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Comisiones de agentes' }));
    expect(screen.queryByLabelText('Estado')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Desde' })).toBeNull();
  });

  it('tiene las tres pestañas, con Resumen activa', () => {
    render(<ReportePage />);
    const pestanas = screen.getAllByRole('tab');
    expect(pestanas.map((p) => p.textContent)).toEqual([
      'Resumen',
      'Comisiones de agentes',
      'Reparto de artistas',
    ]);
    expect(pestanas[0]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('ReportePage — pestaña Resumen', () => {
  it('abre con el dashboard general y sus cinco KPI', () => {
    render(<ReportePage />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Dashboard general' })
    ).toBeInTheDocument();
    const kpis = screen.getAllByRole('group', { name: /^KPI/ });
    expect(kpis).toHaveLength(9);
    expect(kpis[0]).toHaveTextContent('Shows liquidados');
    expect(kpis[0]).toHaveTextContent('23');
    expect(kpis[1]).toHaveTextContent('6450,00 €');
    expect(kpis[4]).toHaveTextContent('Los Canarios');
    expect(kpis[4]).toHaveTextContent('BF 1300,00 €');
    expect(kpis[4]).toHaveTextContent('MF 947,47 €');
  });

  it('pinta el gráfico apilado con leyenda y sus 13 artistas', () => {
    render(<ReportePage />);
    const grafico = screen.getByRole('region', {
      name: 'Fees por artista (Booking + Management apilados)',
    });
    expect(within(grafico).getByText('Booking')).toBeInTheDocument();
    expect(within(grafico).getByText('Management')).toBeInTheDocument();
    expect(within(grafico).getByText('Los Canarios')).toBeInTheDocument();
    expect(within(grafico).getByText('Marian Ariss')).toBeInTheDocument();
    expect(within(grafico).getByText('2400,00 €')).toBeInTheDocument();
  });

  it('sigue con el bloque Por agente y sus cuatro KPI', () => {
    render(<ReportePage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Por agente' })).toBeInTheDocument();
    const kpis = screen.getAllByRole('group', { name: /^KPI/ });
    expect(kpis[5]).toHaveTextContent('Total comisiones');
    expect(kpis[5]).toHaveTextContent('1747,50 €');
    expect(kpis[6]).toHaveTextContent('Agente top (comisión)');
    expect(kpis[6]).toHaveTextContent('Yenifer Bernardo');
    expect(kpis[7]).toHaveTextContent('Más fechas cerradas');
    expect(kpis[7]).toHaveTextContent('14 cierres');
    expect(kpis[8]).toHaveTextContent('Agentes activos');
  });

  it('trae la tabla de agentes con sus seis columnas y cinco filas', () => {
    render(<ReportePage />);
    const tabla = screen.getByRole('table');
    expect(
      within(tabla)
        .getAllByRole('columnheader')
        .map((c) => c.textContent)
    ).toEqual(['Agente', 'Cierres', 'Fee bruto', 'Fee medio', 'Booking fees', 'Comisión']);
    const filas = within(tabla).getAllByRole('row').slice(1);
    expect(filas).toHaveLength(5);
    // El `textContent` crudo lleva el espacio duro del live antes del €.
    expect(
      within(filas[0])
        .getAllByRole('cell')
        .map((c) => c.textContent)
    ).toEqual([
      'Yenifer Bernardo',
      '14',
      '22.650,00\u00a0€',
      '1617,86\u00a0€',
      '4810,00\u00a0€',
      '1227,50\u00a0€',
    ]);
  });

  it('cierra con la nota al pie y la vista por artista vacía', () => {
    render(<ReportePage />);
    expect(screen.getByText(/^Cierres = fechas que trae el agente/)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Vista por artista' })
    ).toBeInTheDocument();
    const select = screen.getByLabelText('Vista por artista');
    expect(within(select).getAllByRole('option')).toHaveLength(194);
    expect(screen.getByText('Selecciona un artista para ver su detalle.')).toBeInTheDocument();
  });
});

describe('ReportePage — el filtro Estado no es decorativo', () => {
  it('cambiar a «Todos» cambia el rótulo, los KPI y la tabla', async () => {
    const user = userEvent.setup();
    render(<ReportePage />);
    expect(screen.getByText('Shows liquidados')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(6);

    await user.selectOptions(screen.getByLabelText('Estado'), 'Todos');

    expect(screen.queryByText('Shows liquidados')).toBeNull();
    expect(screen.getByText('Shows')).toBeInTheDocument();
    expect(screen.getByText('251')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(8);
    expect(screen.getAllByText('Aldo Messina').length).toBeGreaterThan(0);
  });

  it('«Pendientes de liquidar» trae sus propias cifras', async () => {
    const user = userEvent.setup();
    render(<ReportePage />);
    await user.selectOptions(screen.getByLabelText('Estado'), 'Pendientes de liquidar');
    expect(screen.getByText('Shows pendientes')).toBeInTheDocument();
    expect(screen.getByText('228')).toBeInTheDocument();
    expect(screen.getAllByText('Bizza').length).toBeGreaterThan(0);
  });

  it('el gráfico apilado también cambia de artistas', async () => {
    const user = userEvent.setup();
    render(<ReportePage />);
    const grafico = () =>
      screen.getByRole('region', { name: 'Fees por artista (Booking + Management apilados)' });
    expect(within(grafico()).getByText('Los Canarios')).toBeInTheDocument();
    // Aaron Martin no tiene nada liquidado, así que aquí no sale.
    expect(within(grafico()).queryByText('Aaron Martin')).toBeNull();

    await user.selectOptions(screen.getByLabelText('Estado'), 'Todos');
    expect(within(grafico()).getByText('Aaron Martin')).toBeInTheDocument();
  });
});

describe('ReportePage — pestaña Comisiones de agentes', () => {
  it('cambia a los tres KPI de abonos', async () => {
    await irA('Comisiones de agentes');
    expect(screen.queryByRole('table')).toBeNull();
    const kpis = screen.getAllByRole('group', { name: /^KPI/ });
    expect(kpis).toHaveLength(3);
    expect(kpis[0]).toHaveTextContent('Devengado total');
    expect(kpis[0]).toHaveTextContent('1747,50 €');
    expect(kpis[1]).toHaveTextContent('Abonado');
    expect(kpis[2]).toHaveTextContent('Pendiente de abonar');
  });

  it('lista los cinco agentes, no como tabla sino como filas con sus dos botones', async () => {
    await irA('Comisiones de agentes');
    const filas = screen.getAllByRole('group', { name: /^Comisión de / });
    expect(filas).toHaveLength(5);
    expect(filas[0]).toHaveTextContent('Yenifer Bernardo');
    expect(filas[0]).toHaveTextContent('15 shows liquidados · 0 abonos');
    expect(filas[0]).toHaveTextContent('1227,50 €');
    expect(within(filas[0]).getByRole('button', { name: 'Detalle' })).toBeInTheDocument();
    expect(within(filas[0]).getByRole('button', { name: 'Registrar abono' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Registrar abono' })).toHaveLength(5);
  });
});

describe('ReportePage — pestaña Reparto de artistas', () => {
  it('abre con la carga por persona, agrupada por rol', async () => {
    await irA('Reparto de artistas');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Carga por persona' })
    ).toBeInTheDocument();
    const roles = screen.getAllByRole('heading', { level: 3 });
    expect(roles.map((r) => r.textContent)).toEqual(['Agentes', 'Advancing', 'Logística']);
    expect(screen.getByText('8 pers. · 41 artistas')).toBeInTheDocument();
  });

  it('sólo Advancing lleva el aviso rosa de sin asignar', async () => {
    await irA('Reparto de artistas');
    const avisos = screen.getAllByText('Sin asignar');
    expect(avisos).toHaveLength(1);
    expect(avisos[0].closest('li')).toHaveTextContent('1');
    expect(avisos[0].closest('li')).toHaveTextContent('art. · 0 bolos');
  });

  it('lista los 41 artistas con sus tres columnas de rol', async () => {
    await irA('Reparto de artistas');
    const filas = screen.getAllByRole('group', { name: /^Reparto de / });
    expect(filas).toHaveLength(41);
    const aaron = filas[0];
    expect(aaron).toHaveTextContent('Aaron Martin');
    expect(within(aaron).getByTitle('Bolos próximos')).toHaveTextContent('3 🎫');
    expect(within(aaron).getByText('Aldo')).toBeInTheDocument();
    expect(within(aaron).getByText('Joe')).toBeInTheDocument();
    expect(within(aaron).getByText('Meritxell')).toBeInTheDocument();
    expect(within(aaron).getAllByRole('button', { name: /Añadir/ })).toHaveLength(3);
  });

  it('pinta las iniciales de cada persona, y nunca una foto', async () => {
    const { container } = render(<ReportePage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: 'Reparto de artistas' }));
    const aaron = screen.getAllByRole('group', { name: /^Reparto de / })[0];
    expect(within(aaron).getByLabelText('Aldo Messina')).toHaveTextContent('AM');
    expect(within(aaron).getByLabelText('Meritxell Pareja Casalí')).toHaveTextContent('MC');
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('«Solo sin asignar» deja el único artista al que le falta un rol', async () => {
    const user = userEvent.setup();
    render(<ReportePage />);
    await user.click(screen.getByRole('tab', { name: 'Reparto de artistas' }));

    const boton = screen.getByRole('button', { name: /Solo sin asignar/ });
    expect(boton).toHaveTextContent('(1)');
    await user.click(boton);

    const filas = screen.getAllByRole('group', { name: /^Reparto de / });
    expect(filas).toHaveLength(1);
    expect(filas[0]).toHaveTextContent('Sadkiel');
  });
});
