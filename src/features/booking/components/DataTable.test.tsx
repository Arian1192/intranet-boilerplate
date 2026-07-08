import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from './DataTable';

const mockShows = [
  {
    id: '1',
    name: 'Evento Primavera',
    client: 'Cliente A',
    date: '15 jul 2026',
    status: 'confirmed' as const,
    amount: 3500,
  },
];

describe('DataTable', () => {
  it('renders show rows', () => {
    render(<DataTable shows={mockShows} />);
    expect(screen.getByText('Evento Primavera')).toBeInTheDocument();
    expect(screen.getByText('Cliente A')).toBeInTheDocument();
    expect(screen.getByText(/3500,00/)).toBeInTheDocument();
  });
});
