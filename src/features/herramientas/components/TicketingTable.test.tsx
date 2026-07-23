import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { TicketingTable } from './TicketingTable';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

function Wrapper({ onUpdate }: { onUpdate: (patch: Partial<Proyeccion>) => void }) {
  const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
  return (
    <TicketingTable
      proyeccion={p}
      escenario="base"
      onUpdate={(patch) => {
        setP((prev) => ({ ...prev, ...patch }));
        onUpdate(patch);
      }}
    />
  );
}

describe('TicketingTable', () => {
  it('renders las 7 filas del seed con release/entradas/precio/facturación, y el total', () => {
    render(<TicketingTable proyeccion={seedProyecciones[0]} escenario="base" onUpdate={vi.fn()} />);
    expect(screen.getByDisplayValue('Early Access - acceso antes de las 7:30pm')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Taquilla')).toBeInTheDocument();
    expect(screen.getByText(/^800,00\s?€$/)).toBeInTheDocument(); // fila 1: 100×8
    expect(screen.getByText(/Total ticketing/)).toBeInTheDocument();
    expect(screen.getByText(/600 entradas/)).toBeInTheDocument();
    // Por acuerdo (base): ingresoTramo(ticketing, waterfall(450)=4600, iva 10%) = 4181,82€
    expect(screen.getByText(/4\.?181,82/)).toBeInTheDocument();
  });

  it('editar ENTRADAS de una fila llama onUpdate con la fila parcheada', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const entradasInputs = screen.getAllByLabelText('Entradas');
    await userEvent.clear(entradasInputs[0]);
    await userEvent.type(entradasInputs[0], '120');
    expect(onUpdate).toHaveBeenLastCalledWith({
      ticketing: expect.arrayContaining([expect.objectContaining({ id: 'tk-1', entradas: 120 })]),
    });
  });

  it('primera fila tiene ↑ deshabilitado, última tiene ↓ deshabilitado', () => {
    render(<TicketingTable proyeccion={seedProyecciones[0]} escenario="base" onUpdate={vi.fn()} />);
    const subir = screen.getAllByRole('button', { name: '↑' });
    const bajar = screen.getAllByRole('button', { name: '↓' });
    expect(subir[0]).toBeDisabled();
    expect(bajar[bajar.length - 1]).toBeDisabled();
  });

  it('borrar una fila la quita de la lista', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const borrar = screen.getAllByRole('button', { name: '×' });
    await userEvent.click(borrar[0]);
    expect(onUpdate).toHaveBeenLastCalledWith({
      ticketing: expect.not.arrayContaining([expect.objectContaining({ id: 'tk-1' })]),
    });
  });

  it('"+ Añadir" agrega una fila nueva al final', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Añadir' }));
    const call = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call.ticketing).toHaveLength(8);
  });

  it('checkbox "Desglosar por ticketera" muestra sub-fila con canales al marcarlo', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    expect(screen.queryByText(/Reparto ticketeras/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Desglosar por ticketera (Fourvenues, RA, DICE…)'));
    expect(screen.getAllByText(/Reparto ticketeras/).length).toBeGreaterThan(0);
    const addCanal = screen.getAllByRole('button', { name: '+ ticketera' });
    await userEvent.click(addCanal[0]);
    const call = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call.ticketing[0].canales).toHaveLength(1);
  });
});
