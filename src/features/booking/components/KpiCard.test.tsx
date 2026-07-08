import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from './KpiCard';

const mockKpi = {
  id: '1',
  label: 'CONFIRMADO',
  amount: 7000,
  count: 4,
  status: 'confirmed' as const,
};

describe('KpiCard', () => {
  it('renders amount, label and count', () => {
    render(<KpiCard kpi={mockKpi} />);
    expect(screen.getByText(/7000,00/)).toBeInTheDocument();
    expect(screen.getByText('CONFIRMADO')).toBeInTheDocument();
    expect(screen.getByText('4 shows')).toBeInTheDocument();
  });
});
