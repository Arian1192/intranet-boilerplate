import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RangoPopover } from './RangoPopover';

const rango = { desde: 'ultima-semana', hasta: 'todo-futuro' } as const;

describe('RangoPopover', () => {
  it('no renderiza nada cuando está cerrado', () => {
    const { container } = render(
      <RangoPopover abierto={false} rango={rango} onChange={() => {}} onClose={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra las opciones exactas de Desde y Hasta y emite onChange', () => {
    const onChange = vi.fn();
    render(<RangoPopover abierto rango={rango} onChange={onChange} onClose={() => {}} />);

    const desde = screen.getByLabelText('Desde');
    expect(Array.from(desde.querySelectorAll('option')).map((o) => o.textContent)).toEqual([
      'Última semana', 'Últimos 3 días', 'Último mes', 'Último año', 'Todo el pasado',
    ]);
    const hasta = screen.getByLabelText('Hasta');
    expect(Array.from(hasta.querySelectorAll('option')).map((o) => o.textContent)).toEqual([
      'Todo el futuro', 'Próximos 3 días', 'Próxima semana', 'Próximo mes', 'Próximo año', 'Hasta hoy',
    ]);

    fireEvent.change(hasta, { target: { value: 'hasta-hoy' } });
    expect(onChange).toHaveBeenCalledWith({ ...rango, hasta: 'hasta-hoy' });
  });
});
