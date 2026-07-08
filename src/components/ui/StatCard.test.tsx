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
});
