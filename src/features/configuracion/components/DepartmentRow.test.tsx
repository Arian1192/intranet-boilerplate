import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DepartmentRow } from './DepartmentRow';

describe('DepartmentRow', () => {
  it('activo: muestra "Desactivar"', () => {
    render(<DepartmentRow department={{ id: 'd1', name: 'Booking', color: 'blue', active: true }} onToggleActive={() => {}} onRemove={() => {}} />);
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument();
  });

  it('inactivo: muestra "Activar"', () => {
    render(<DepartmentRow department={{ id: 'd2', name: 'Diseño', color: 'green', active: false }} onToggleActive={() => {}} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activar' })).toBeInTheDocument();
  });

  it('Desactivar y ✕ llaman a los callbacks', async () => {
    const onToggleActive = vi.fn();
    const onRemove = vi.fn();
    render(<DepartmentRow department={{ id: 'd1', name: 'Booking', color: 'blue', active: true }} onToggleActive={onToggleActive} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    expect(onToggleActive).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: /Eliminar/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
