import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostByPersonCard } from './CostByPersonCard';
import { costRankingByPerson } from '../data/fichas';

describe('CostByPersonCard', () => {
  it('renders ranking with Alberto Egea first', () => {
    render(<CostByPersonCard ranking={costRankingByPerson()} />);
    expect(screen.getByText('COSTE POR PERSONA')).toBeInTheDocument();
    const amounts = screen.getAllByText(/\d+,\d{2}\s*€/);
    expect(amounts.length).toBe(19);
    expect(screen.getByText('Alberto Egea')).toBeInTheDocument();
  });
});
