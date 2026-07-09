import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders label, value and change', () => {
    render(<StatCard label="Cuentas activas" value="2" change="+1" />);
    expect(screen.getByText('Cuentas activas')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('renders caption and applies valueClassName', () => {
    render(<StatCard label="RETORNO" value="100%" caption="2 de 2 publicados" valueClassName="text-emerald-600" />);
    expect(screen.getByText('2 de 2 publicados')).toBeInTheDocument();
    expect(screen.getByText('100%')).toHaveClass('text-emerald-600');
  });
});
