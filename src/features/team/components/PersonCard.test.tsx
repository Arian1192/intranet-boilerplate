import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PersonCard } from './PersonCard';
import type { Person } from '../data/types';

const base: Person = {
  id: 'p-1',
  name: 'Test Person',
  positions: ['Dev'],
  primaryPosition: 'Dev',
  department: 'Engineering',
  email: 'test@example.com',
  avatarColor: '#3B82F6',
};

describe('PersonCard', () => {
  it('renders initials, name, position, department and email', () => {
    render(<MemoryRouter><PersonCard person={base} /></MemoryRouter>);
    expect(screen.getByText('Test Person')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('TP')).toBeInTheDocument();
  });

  it('shows fallback text for missing contacts', () => {
    render(<MemoryRouter><PersonCard person={{ ...base, email: undefined, phone: undefined }} /></MemoryRouter>);
    expect(screen.getByText('Sin email')).toBeInTheDocument();
    expect(screen.getByText('Sin teléfono')).toBeInTheDocument();
  });

  it('renders manager link text when manager name is provided', () => {
    render(<MemoryRouter><PersonCard person={base} managerName="Boss Name" /></MemoryRouter>);
    expect(screen.getByText(/Reporta a Boss Name/)).toBeInTheDocument();
  });

  it('navigates to fichas with p query param', () => {
    render(<MemoryRouter><PersonCard person={base} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /Ver ficha personal/ })).toHaveAttribute('href', '/personal/fichas?p=p-1');
  });
});
