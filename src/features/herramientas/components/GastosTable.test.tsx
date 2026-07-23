import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { GastosTable } from './GastosTable';
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
import { seedProyecciones } from '../data/seed';
import type { Gasto } from '../data/types';

const p = seedProyecciones[0];
const brutos = calcularBrutosEscenario(p, 'base');

function Wrapper({ onUpdate }: { onUpdate: (gastos: Gasto[]) => void }) {
  const [gastos, setGastos] = useState<Gasto[]>(p.gastos);
  return (
    <GastosTable
      gastos={gastos}
      brutos={brutos}
      eventoAforo={p.eventoAforo}
      onUpdate={(next) => {
        setGastos(next);
        onUpdate(next);
      }}
    />
  );
}

describe('GastosTable', () => {
  it('renders las 7 filas del seed con importe calculado y el total -5.470,00€', () => {
    render(<GastosTable gastos={p.gastos} brutos={brutos} eventoAforo={p.eventoAforo} onUpdate={vi.fn()} />);
    expect(screen.getByDisplayValue('US TWO - AF')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Euphoric Media Fee')).toBeInTheDocument();
    expect(screen.getByText(/^-2\.?000,00\s?€$/)).toBeInTheDocument();
    expect(screen.getByText(/Total gastos/)).toBeInTheDocument();
    expect(screen.getByText(/^-5\.?470,00\s?€$/)).toBeInTheDocument();
  });

  it('"+ Añadir" agrega una fila con los defaults', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Añadir' }));
    const call: Gasto[] = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call).toHaveLength(8);
    expect(call[7]).toMatchObject({ categoria: 'Artística', concepto: '', base: 'importe_fijo', valor: 0, paga: 'nosotros' });
  });

  it('borrar una fila la quita de la lista', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const borrar = screen.getAllByRole('button', { name: '×' });
    await userEvent.click(borrar[0]);
    const call: Gasto[] = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call.find((g) => g.id === 'gasto-1')).toBeUndefined();
  });

  it('cambiar BASE a "% ticketing neto" recalcula el importe en vivo', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const baseSelects = screen.getAllByLabelText('Base');
    await userEvent.selectOptions(baseSelects[0], '% ticketing neto');
    const call: Gasto[] = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call[0].base).toBe('pct_ticketing_neto');
  });

  it('togglear PAGA cambia Nosotros/Venue', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const venueButtons = screen.getAllByRole('button', { name: 'Venue' });
    await userEvent.click(venueButtons[0]);
    const call: Gasto[] = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call[0].paga).toBe('venue');
  });
});
