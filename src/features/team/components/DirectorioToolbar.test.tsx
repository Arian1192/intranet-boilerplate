import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectorioToolbar } from './DirectorioToolbar';

describe('DirectorioToolbar', () => {
  it('calls onQuery when typing', () => {
    const onQuery = vi.fn();
    render(<DirectorioToolbar query="" onQuery={onQuery} departments={[]} department="" onDepartment={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), { target: { value: 'alba' } });
    expect(onQuery).toHaveBeenLastCalledWith('alba');
  });

  it('calls onDepartment when selecting', async () => {
    const onDepartment = vi.fn();
    render(<DirectorioToolbar query="" onQuery={() => {}} departments={['Marketing', 'Booking']} department="" onDepartment={onDepartment} />);
    await userEvent.selectOptions(screen.getByLabelText('Departamento'), 'Marketing');
    expect(onDepartment).toHaveBeenCalledWith('Marketing');
  });
});
