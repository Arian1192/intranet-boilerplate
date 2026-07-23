import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrgRow } from './OrgRow';
import type { Person } from '../data/types';

const person: Person = {
  id: 'p-1', name: 'Manager', positions: ['Lead'], primaryPosition: 'Lead', department: 'Eng',
  email: 'm@example.com', avatarColor: '#000',
};
const report: Person = {
  id: 'p-2', name: 'Report', positions: ['Dev'], primaryPosition: 'Dev', department: 'Eng',
  managerId: 'p-1', avatarColor: '#fff',
};

describe('OrgRow', () => {
  it('renders name and label', () => {
    render(<MemoryRouter><OrgRow person={person} /></MemoryRouter>);
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Lead · Eng')).toBeInTheDocument();
  });

  it('shows badge when there are direct reports', () => {
    render(<MemoryRouter><OrgRow person={person} reports={[report]} /></MemoryRouter>);
    expect(screen.getByText('1 persona')).toBeInTheDocument();
  });

  it('renders email icon when email exists', () => {
    render(<MemoryRouter><OrgRow person={person} /></MemoryRouter>);
    expect(screen.getByLabelText('Enviar email')).toBeInTheDocument();
  });

  it('links to ficha', () => {
    render(<MemoryRouter><OrgRow person={person} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Ficha' })).toHaveAttribute('href', '/personal/fichas?p=p-1');
  });
});
