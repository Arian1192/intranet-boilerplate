import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HolidayRow } from './HolidayRow';

describe('HolidayRow', () => {
  it('formatea la fecha, muestra nombre y chip de ámbito (Catalunya = ámbar)', () => {
    render(<HolidayRow holiday={{ id: 'h1', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' }} onRemove={() => {}} />);
    expect(screen.getByText('11 sept 2026')).toBeInTheDocument();
    expect(screen.getByText('Diada de Catalunya')).toBeInTheDocument();
    expect(screen.getByText('Catalunya')).toHaveClass('bg-amber-100');
  });

  it('Barcelona = chip azul, España = chip gris', () => {
    const { rerender } = render(<HolidayRow holiday={{ id: 'h2', date: '2026-09-24', name: 'La Mercè', scope: 'barcelona' }} onRemove={() => {}} />);
    expect(screen.getByText('Barcelona')).toHaveClass('bg-sky-100');
    rerender(<HolidayRow holiday={{ id: 'h3', date: '2026-08-15', name: "L'Assumpció", scope: 'espana' }} onRemove={() => {}} />);
    expect(screen.getByText('España')).toHaveClass('bg-slate-100');
  });

  it('✕ llama a onRemove', async () => {
    const onRemove = vi.fn();
    render(<HolidayRow holiday={{ id: 'h1', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' }} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: /Eliminar/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
