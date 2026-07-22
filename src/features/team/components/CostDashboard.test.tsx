import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostDashboard } from './CostDashboard';

describe('CostDashboard', () => {
  it('renders total and both cards', () => {
    render(<CostDashboard />);
    expect(screen.getByText(/Coste mensual estimado total:/)).toBeInTheDocument();
    expect(screen.getByText(/34\.522,07\s*€/)).toBeInTheDocument();
    expect(screen.getByText('COSTE POR EMPRESA')).toBeInTheDocument();
    expect(screen.getByText('COSTE POR PERSONA')).toBeInTheDocument();
  });
});
