import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ActivacionesPage } from './ActivacionesPage';
import { ACTIVACIONES } from '@/features/booking/data/management-activaciones';

async function elegir(filtro: string, opcion: string) {
  const usuario = userEvent.setup();
  await usuario.click(screen.getByRole('button', { name: filtro }));
  await usuario.click(screen.getByRole('option', { name: opcion }));
}

function fila(titulo: string) {
  return screen.getByText(titulo).closest('.flex.items-center.gap-3') as HTMLElement;
}

describe('ActivacionesPage — calco del live', () => {
  it('trae las 31 activaciones y el contador usa el plural con tilde del live', () => {
    render(<ActivacionesPage />);
    expect(ACTIVACIONES).toHaveLength(31);
    expect(screen.getByText('31 activaciónes')).toBeInTheDocument();
  });

  it('agrupa por mes con los cinco rótulos del live, en su orden', () => {
    render(<ActivacionesPage />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'septiembre de 2026',
      'octubre de 2026',
      'noviembre de 2026',
      'diciembre de 2026',
      'enero de 2027',
    ]);
    // El `capitalize` que los sube a «Septiembre De 2026» es del CSS, no del texto.
    expect(screen.getByText('septiembre de 2026')).toHaveClass('capitalize');
  });

  it('deriva el día y el día de la semana de la fecha, con los literales del live', () => {
    render(<ActivacionesPage />);
    const primera = fila('"What it Do" single release -');
    expect(within(primera).getByText('10')).toBeInTheDocument();
    expect(within(primera).getByText('jue')).toBeInTheDocument();
    expect(within(fila('Grabación - UNVRS')).getByText('sáb')).toBeInTheDocument();
    expect(within(fila('Metamorfosi VA Release')).getByText('mié')).toBeInTheDocument();
  });

  it('pinta el artista y, tras el punto medio, su nota', () => {
    render(<ActivacionesPage />);
    expect(
      within(fila('YouTube Set: Cova Santa')).getByText('Abdon · Activamos campaña de google ads')
    ).toBeInTheDocument();
    expect(within(fila('YouTube Set: Tantra Ibiza')).getByText('DH Moon')).toBeInTheDocument();
  });

  it('las 31 arrancan en Programada, que es lo que enseña el PNG de la captura', () => {
    render(<ActivacionesPage />);
    const estados = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(estados).toHaveLength(31);
    expect(estados.every((s) => s.value === 'Programada')).toBe(true);
    expect([...estados[0].options].map((o) => o.text)).toEqual([
      'Programada',
      'En curso',
      'Hecha',
      'Perdida',
    ]);
  });

  it('el select de estado cambia el seed en local', async () => {
    const usuario = userEvent.setup();
    render(<ActivacionesPage />);
    const select = within(fila('Brunch Show - Grabación')).getByRole(
      'combobox'
    ) as HTMLSelectElement;
    await usuario.selectOptions(select, 'Hecha');
    expect(select.value).toBe('Hecha');
  });

  it('el aspa quita la fila y baja el contador', async () => {
    const usuario = userEvent.setup();
    render(<ActivacionesPage />);
    await usuario.click(within(fila('Grabación - UNVRS')).getByTitle('Eliminar'));
    expect(screen.queryByText('Grabación - UNVRS')).not.toBeInTheDocument();
    expect(screen.getByText('30 activaciónes')).toBeInTheDocument();
  });

  it('el filtro de tipos deja sólo ese tipo y el contador cuenta lo filtrado', async () => {
    render(<ActivacionesPage />);
    await elegir('Todos los tipos', 'Show');
    expect(screen.getByText('1 activación')).toBeInTheDocument();
    expect(screen.getByText('15 DIAS EN ESPAÑA')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });

  it('sin resultados escribe el vacío literal del live, sin tilde esta vez', async () => {
    render(<ActivacionesPage />);
    await elegir('Todos los artistas', 'Freddy Bello');
    expect(screen.getByText('0 activaciónes')).toBeInTheDocument();
    expect(screen.getByText('Sin activaciones.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('«Solo futuras» viene marcada, como en el live', () => {
    render(<ActivacionesPage />);
    expect(screen.getByLabelText('Solo futuras')).toBeChecked();
  });
});

describe('ActivacionesPage — el modal de edición', () => {
  it('el título de la fila abre `Editar activación` con sus datos', async () => {
    const usuario = userEvent.setup();
    render(<ActivacionesPage />);
    await usuario.click(screen.getByText('Brunch Show - Grabación'));
    expect(
      screen.getByRole('heading', { name: 'Editar activación', level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue('Brunch Show - Grabación');
    expect(screen.getByLabelText('Artista')).toHaveValue('Londonground');
  });

  it('guardar un cambio de tipo se ve en la fila', async () => {
    const usuario = userEvent.setup();
    render(<ActivacionesPage />);
    await usuario.click(screen.getByText('Brunch Show - Grabación'));
    await usuario.selectOptions(screen.getByLabelText('Tipo'), 'Entrega');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(within(fila('Brunch Show - Grabación')).getByText('Entrega')).toBeInTheDocument();
  });

  it('guardar conserva el estado, que no vive en el modal sino en la fila', async () => {
    const usuario = userEvent.setup();
    render(<ActivacionesPage />);
    const select = within(fila('Brunch Show - Grabación')).getByRole(
      'combobox'
    ) as HTMLSelectElement;
    await usuario.selectOptions(select, 'En curso');
    await usuario.click(screen.getByText('Brunch Show - Grabación'));
    await usuario.selectOptions(screen.getByLabelText('Tipo'), 'Show');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(
      (within(fila('Brunch Show - Grabación')).getByRole('combobox') as HTMLSelectElement).value
    ).toBe('En curso');
  });
});
