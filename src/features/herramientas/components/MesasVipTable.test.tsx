import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { MesasVipTable } from './MesasVipTable';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

function Wrapper({ onUpdate, escenario = 'base' as const }: { onUpdate: (patch: Partial<Proyeccion>) => void; escenario?: 'pesimista' | 'base' | 'optimista' }) {
  const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
  return (
    <MesasVipTable
      proyeccion={p}
      escenario={escenario}
      onUpdate={(patch) => {
        setP((prev) => ({ ...prev, ...patch }));
        onUpdate(patch);
      }}
    />
  );
}

describe('MesasVipTable modo real', () => {
  it('modo="real": añade MESAS REAL y total real 0,00€ (mesasReal 0)', () => {
    render(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="base" modo="real" onUpdate={vi.fn()} />);
    expect(screen.getByText(/^mesas real$/i)).toBeInTheDocument();
    // total real y "por acuerdo" real = 0,00€ (getAll: aparece más de una vez)
    expect(screen.getAllByText(/^0,00\s?€$/).length).toBeGreaterThan(0);
  });

  it('modo="prevision" (default) no muestra MESAS REAL', () => {
    render(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="base" onUpdate={vi.fn()} />);
    expect(screen.queryByText(/^mesas real$/i)).not.toBeInTheDocument();
  });
});

describe('MesasVipTable', () => {
  it('renders las 3 zonas del seed con su facturación y el total 12.790,00€ / Por acuerdo 953,44€', () => {
    render(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="base" onUpdate={vi.fn()} />);
    expect(screen.getByDisplayValue('Zona 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Zona 3')).toBeInTheDocument();
    expect(screen.getByText(/^5\.?100,00\s?€$/)).toBeInTheDocument();
    expect(screen.getByText(/12\.?790,00/)).toBeInTheDocument();
    expect(screen.getByText(/953,44/)).toBeInTheDocument();
  });

  it('"Por acuerdo" NO depende del escenario (VIP no se escala — ver spec §3.3)', () => {
    const { rerender } = render(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="pesimista" onUpdate={vi.fn()} />);
    expect(screen.getByText(/953,44/)).toBeInTheDocument();
    rerender(<MesasVipTable proyeccion={seedProyecciones[0]} escenario="optimista" onUpdate={vi.fn()} />);
    expect(screen.getByText(/953,44/)).toBeInTheDocument();
  });

  it('editar MESAS de una fila llama onUpdate con la fila parcheada', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const mesasInputs = screen.getAllByLabelText('Mesas');
    await userEvent.clear(mesasInputs[0]);
    await userEvent.type(mesasInputs[0], '7');
    expect(onUpdate).toHaveBeenLastCalledWith({
      mesasVip: expect.arrayContaining([expect.objectContaining({ id: 'vip-1', mesas: 7 })]),
    });
  });

  it('borrar una fila la quita de la lista', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const borrar = screen.getAllByRole('button', { name: '×' });
    await userEvent.click(borrar[0]);
    expect(onUpdate).toHaveBeenLastCalledWith({
      mesasVip: expect.not.arrayContaining([expect.objectContaining({ id: 'vip-1' })]),
    });
  });

  it('"+ Añadir" agrega una fila nueva', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    await userEvent.click(screen.getByRole('button', { name: '+ Añadir' }));
    const call = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(call.mesasVip).toHaveLength(4);
  });
});
