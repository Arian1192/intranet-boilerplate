import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostByCompanyCard } from './CostByCompanyCard';
import { companies } from '../data/fichas';

describe('CostByCompanyCard', () => {
  it('renders all companies with progress bars', () => {
    render(<CostByCompanyCard companies={companies} />);
    expect(screen.getByText('COSTE POR EMPRESA')).toBeInTheDocument();
    expect(screen.getByText('ConceptOne')).toBeInTheDocument();
    expect(screen.getByText(/11\.460,00\s*€/)).toBeInTheDocument();
  });
});
