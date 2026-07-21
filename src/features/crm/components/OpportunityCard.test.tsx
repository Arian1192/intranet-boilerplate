import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OpportunityCard } from './OpportunityCard';
import { opportunities } from '../data/pipeline';

const opp = opportunities.find((o) => o.id === 'op1')!; // Foot District 48.000

describe('OpportunityCard', () => {
  it('renders client name, amount, close date, note and owner initials', () => {
    render(<OpportunityCard opp={opp} canPrev canNext onMove={() => {}} />);
    expect(screen.getByText('Foot District')).toBeInTheDocument();
    expect(screen.getByText(/48\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/Cierre:/)).toBeInTheDocument();
    expect(screen.getByText(/Mostrar la oficina reformada/)).toBeInTheDocument();
    expect(screen.getByText('IC')).toBeInTheDocument();
  });

  it('calls onMove with direction and disables edges', () => {
    const onMove = vi.fn();
    render(<OpportunityCard opp={opp} canPrev={false} canNext onMove={onMove} />);
    const prev = screen.getByRole('button', { name: 'Mover a etapa anterior' });
    const next = screen.getByRole('button', { name: 'Mover a etapa siguiente' });
    expect(prev).toBeDisabled();
    fireEvent.click(next);
    expect(onMove).toHaveBeenCalledWith(1);
  });
});
