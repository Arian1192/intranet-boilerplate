import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { BarrasComidaMerchCards } from './BarrasComidaMerchCards';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

function Wrapper({ onUpdate }: { onUpdate: (patch: Partial<Proyeccion>) => void }) {
  const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
  return (
    <BarrasComidaMerchCards
      proyeccion={p}
      escenario="base"
      onUpdate={(patch) => {
        setP((prev) => ({ ...prev, ...patch }));
        onUpdate(patch);
      }}
    />
  );
}

describe('BarrasComidaMerchCards', () => {
  it('con escenario base: Barras 15.000,00€/1.118,18€, Comida 1.125,00€/76,70€, Merch 0,00€/0,00€, total 16.125,00€/1.194,89€', () => {
    render(<BarrasComidaMerchCards proyeccion={seedProyecciones[0]} escenario="base" onUpdate={vi.fn()} />);
    expect(screen.getByText('Barras')).toBeInTheDocument();
    expect(screen.getByText(/^15\.?000,00\s?€$/)).toBeInTheDocument();
    expect(screen.getByText(/1\.?118,18/)).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText(/^1\.?125,00\s?€$/)).toBeInTheDocument();
    expect(screen.getByText(/76,70/)).toBeInTheDocument();
    expect(screen.getByText('Merch')).toBeInTheDocument();
    expect(screen.getByText('3.0 cons./pax en 6h')).toBeInTheDocument();
    expect(screen.getAllByText(/Barras, comida y merch/).length).toBeGreaterThan(0);
    expect(screen.getByText(/^16\.?125,00\s?€$/)).toBeInTheDocument();
    expect(screen.getByText(/1\.?194,89/)).toBeInTheDocument();
  });

  it('editar CONSUMICIONES/HORA llama onUpdate con barrasComidaMerch actualizado', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const input = screen.getByLabelText('CONSUMICIONES / HORA');
    await userEvent.clear(input);
    await userEvent.type(input, '1');
    expect(onUpdate).toHaveBeenLastCalledWith({
      barrasComidaMerch: expect.objectContaining({ barras: expect.objectContaining({ consumicionesHora: 1 }) }),
    });
  });
});
