import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrgForm } from './OrgForm';

describe('OrgForm', () => {
  it('renders key fields with Cliente checked by default and toggles a company chip', () => {
    render(<OrgForm onClose={() => {}} />);
    expect(screen.getByPlaceholderText('Escribe la dirección y elige un resultado…')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Cliente' })).toBeChecked();
    const chip = screen.getByRole('button', { name: 'ConceptOne' });
    expect(chip).toHaveClass('border-slate-200');
    fireEvent.click(chip);
    expect(chip).toHaveClass('bg-brand-50', 'text-brand-700');
  });

  it('calls onClose from Guardar and Cancelar', () => {
    const onClose = vi.fn();
    render(<OrgForm onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
