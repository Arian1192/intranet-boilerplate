import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { AcuerdoTab } from './AcuerdoTab';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

describe('AcuerdoTab', () => {
  it('renders the 5 tramos, the help paragraph, gastos and the Resultado card', () => {
    render(<AcuerdoTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    ['Ticketing', 'Mesas VIP', 'Barras', 'Comida', 'Merchandising'].forEach((titulo) => {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    });
    expect(screen.getByText(/Ej\. PQ @ SLS: ticketing 100%/)).toBeInTheDocument();
    expect(screen.getByText('¿Quién paga cada gasto?')).toBeInTheDocument();
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Aplicar acuerdo/)).toBeChecked();
  });

  it('editing a tramo calls onUpdate with the patched acuerdo', async () => {
    // Wrapper con estado local: AcuerdoTab (vía AcuerdoTramoCard) es 100% controlado, así que
    // sin un contenedor que re-renderice con la `proyeccion` actualizada en cada onUpdate,
    // userEvent.type escribiría siempre sobre el valor fijo del prop original (mismo motivo
    // que en el test de AcuerdoTramoCard, Tarea 11).
    const onUpdate = vi.fn();
    function Wrapper() {
      const [proyeccion, setProyeccion] = useState<Proyeccion>(seedProyecciones[0]);
      return (
        <AcuerdoTab
          proyeccion={proyeccion}
          onUpdate={(patch) => {
            setProyeccion((prev) => ({ ...prev, ...patch }));
            onUpdate(patch);
          }}
        />
      );
    }
    render(<Wrapper />);
    const inputs = screen.getAllByLabelText('Nos llevamos %');
    await userEvent.clear(inputs[0]); // Ticketing es el primer tramo renderizado
    await userEvent.type(inputs[0], '50');
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.acuerdo.ticketing.nosLlevamosPct).toBe(50);
    expect(lastCall.acuerdo.mesasVip).toEqual(seedProyecciones[0].acuerdo.mesasVip); // el resto de tramos no cambia
  });

  it('toggling "Aplicar acuerdo" calls onUpdate', async () => {
    const onUpdate = vi.fn();
    render(<AcuerdoTab proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    await userEvent.click(screen.getByLabelText(/Aplicar acuerdo/));
    expect(onUpdate).toHaveBeenCalledWith({ acuerdo: { ...seedProyecciones[0].acuerdo, aplicarAcuerdo: false } });
  });
});
