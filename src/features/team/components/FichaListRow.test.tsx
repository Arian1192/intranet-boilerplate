import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FichaListRow } from './FichaListRow';
import type { Ficha, Person } from '../data/types';

const person: Person = {
  id: 'p-1', name: 'Alba Gelabert', positions: ['Account Manager'], primaryPosition: 'Account Manager',
  avatarColor: '#000',
};
const ficha: Ficha = {
  id: 'f-1', personId: 'p-1', companyIds: ['conceptone'], employmentType: 'freelance', monthlyCost: 2000,
  hasAccount: true, active: true,
};

describe('FichaListRow', () => {
  it('renders name, type and position', () => {
    render(<FichaListRow person={person} ficha={ficha} />);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByText('Freelance · Account Manager')).toBeInTheDocument();
  });

  it('renders company dots', () => {
    render(<FichaListRow person={person} ficha={ficha} />);
    const dot = screen.getByLabelText('ConceptOne');
    expect(dot).toHaveStyle({ backgroundColor: '#8B5CF6' });
  });
});
