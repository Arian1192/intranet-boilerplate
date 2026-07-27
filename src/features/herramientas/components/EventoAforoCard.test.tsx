import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { EventoAforoCard } from './EventoAforoCard';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

describe('EventoAforoCard', () => {
  it('arranca colapsada con el resumen "18 jul 2026 · 600 · 6h · 500 pax"', () => {
    render(<EventoAforoCard proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByText('18 jul 2026 · 600 · 6h · 500 pax')).toBeInTheDocument();
  });

  it('al expandir, muestra los campos con los valores sembrados y la nota de asistencia proyectada', async () => {
    render(<EventoAforoCard proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Evento y aforo/ }));
    expect(screen.getByLabelText('NOMBRE')).toHaveValue('PQ @ SLS Barcelona');
    expect(screen.getByLabelText('AFORO MÁXIMO')).toHaveValue(600);
    expect(screen.getByLabelText('DURACIÓN (HORAS)')).toHaveValue(6);
    expect(screen.getByLabelText('INVITACIONES')).toHaveValue(50);
    expect(screen.getByLabelText('IVA TICKETING %')).toHaveValue(10);
    expect(screen.getByLabelText('IVA BARRAS/COMIDA/VIP %')).toHaveValue(10);
    expect(screen.getByText(/Asistencia proyectada 500 = entradas \+ invitaciones · PAX de pago 450/)).toBeInTheDocument();
    expect(screen.getByLabelText('Forzar a mano')).not.toBeChecked();
  });

  it('editar AFORO MÁXIMO llama onUpdate con el eventoAforo actualizado', async () => {
    const onUpdate = vi.fn();
    function Wrapper() {
      const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
      return (
        <EventoAforoCard
          proyeccion={p}
          onUpdate={(patch) => {
            setP((prev) => ({ ...prev, ...patch }));
            onUpdate(patch);
          }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.click(screen.getByRole('button', { name: /Evento y aforo/ }));
    const aforo = screen.getByLabelText('AFORO MÁXIMO');
    await userEvent.clear(aforo);
    await userEvent.type(aforo, '700');
    expect(onUpdate).toHaveBeenLastCalledWith({
      eventoAforo: expect.objectContaining({ aforoMaximo: 700 }),
    });
  });

  it('marcar "Forzar a mano" habilita el input y fija asistenciaForzada', async () => {
    const onUpdate = vi.fn();
    function Wrapper() {
      const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
      return (
        <EventoAforoCard
          proyeccion={p}
          onUpdate={(patch) => {
            setP((prev) => ({ ...prev, ...patch }));
            onUpdate(patch);
          }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.click(screen.getByRole('button', { name: /Evento y aforo/ }));
    await userEvent.click(screen.getByLabelText('Forzar a mano'));
    expect(onUpdate).toHaveBeenLastCalledWith({
      eventoAforo: expect.objectContaining({ asistenciaForzada: expect.any(Number) }),
    });
  });
});
