import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { AjustesEscenariosCard } from './AjustesEscenariosCard';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

describe('AjustesEscenariosCard', () => {
  it('arranca colapsada con el resumen "Base 75% · BE 77%" y expande al clicar', async () => {
    render(<AjustesEscenariosCard proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByText('Base 75% · BE 77%')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Ajustes de escenarios y breakeven/ }));
    expect(screen.getByLabelText('PESIMISTA %')).toHaveValue(50);
    expect(screen.getByLabelText('BASE %')).toHaveValue(75);
    expect(screen.getByLabelText('OPTIMISTA %')).toHaveValue(100);
    expect(screen.getByLabelText('Ticketing')).toBeChecked();
    expect(screen.getByLabelText('Barras')).toBeChecked();
    expect(screen.getByLabelText('Mesas VIP')).not.toBeChecked();
    expect(screen.getByLabelText('Comida')).not.toBeChecked();
    expect(screen.getByLabelText('Merchandising')).not.toBeChecked();
    expect(screen.getByText(/% de venta proyectada 77%/)).toBeInTheDocument();
    expect(screen.getByText(/Entradas necesarias 461/)).toBeInTheDocument();
    expect(screen.getByText(/Asistencia necesaria 511/)).toBeInTheDocument();
  });

  it('cambiar el multiplicador Base llama onUpdate con el ajustesEscenarios actualizado', async () => {
    const onUpdate = vi.fn();
    function Wrapper() {
      const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
      return (
        <AjustesEscenariosCard
          proyeccion={p}
          onUpdate={(patch) => {
            setP((prev) => ({ ...prev, ...patch }));
            onUpdate(patch);
          }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.click(screen.getByRole('button', { name: /Ajustes de escenarios y breakeven/ }));
    const base = screen.getByLabelText('BASE %');
    await userEvent.clear(base);
    await userEvent.type(base, '80');
    expect(onUpdate).toHaveBeenLastCalledWith({
      ajustesEscenarios: expect.objectContaining({ multiplicadorBasePct: 80 }),
    });
  });

  it('togglear una vía de breakeven la añade/quita del array', async () => {
    const onUpdate = vi.fn();
    render(<AjustesEscenariosCard proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    await userEvent.click(screen.getByRole('button', { name: /Ajustes de escenarios y breakeven/ }));
    await userEvent.click(screen.getByLabelText('Mesas VIP'));
    expect(onUpdate).toHaveBeenCalledWith({
      ajustesEscenarios: expect.objectContaining({ viasBreakeven: expect.arrayContaining(['ticketing', 'barras', 'mesas_vip']) }),
    });
  });
});
