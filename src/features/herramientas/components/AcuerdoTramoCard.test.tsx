import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { AcuerdoTramoCard } from './AcuerdoTramoCard';
import type { TramoAcuerdoConfig } from '../data/types';

describe('AcuerdoTramoCard', () => {
  const config = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };

  it('renders the título and the computed "Nuestro ingreso" (Barras del seed: 1.118,18€)', () => {
    render(<AcuerdoTramoCard titulo="Barras" config={config} bruto={15000} ivaPct={10} onChange={vi.fn()} />);
    expect(screen.getByText('Barras')).toBeInTheDocument();
    // Nota: Intl.NumberFormat('es-ES') en este runtime usa minimumGroupingDigits=2,
    // así que los importes de 4 cifras no llevan separador de miles (mismo comportamiento
    // ya observado y tolerado en el test de ProyeccionRow, Tarea 7).
    expect(screen.getByText(/1\.?118,18/)).toBeInTheDocument();
  });

  it('editing "Nos llevamos %" calls onChange with the patched config', async () => {
    // Wrapper con estado local: AcuerdoTramoCard es 100% controlado (no guarda estado propio),
    // así que sin un contenedor que re-renderice con el `config` actualizado en cada onChange,
    // userEvent.type escribiría siempre sobre el mismo valor fijo del prop original.
    const onChange = vi.fn();
    function Wrapper() {
      const [cfg, setCfg] = useState<TramoAcuerdoConfig>(config);
      return (
        <AcuerdoTramoCard
          titulo="Barras"
          config={cfg}
          bruto={15000}
          ivaPct={10}
          onChange={(next) => {
            setCfg(next);
            onChange(next);
          }}
        />
      );
    }
    render(<Wrapper />);
    const input = screen.getByLabelText('Nos llevamos %');
    await userEvent.clear(input);
    await userEvent.type(input, '20');
    expect(onChange).toHaveBeenLastCalledWith({ ...config, nosLlevamosPct: 20 });
  });

  it('toggling Bruto/Neto calls onChange', async () => {
    const onChange = vi.fn();
    render(<AcuerdoTramoCard titulo="Barras" config={config} bruto={15000} ivaPct={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Bruto' }));
    expect(onChange).toHaveBeenCalledWith({ ...config, sobreBase: 'bruto' });
  });
});
