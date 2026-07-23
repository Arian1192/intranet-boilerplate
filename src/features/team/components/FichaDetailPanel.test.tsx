import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FichaDetailPanel } from './FichaDetailPanel';
import type { Ficha, Person } from '../data/types';

const person: Person = {
  id: 'alba-gelabert', name: 'Alba Gelabert', positions: ['Account Manager'], primaryPosition: 'Account Manager',
  department: 'Marketing', email: 'alba@blackmoose.es', avatarColor: '#000',
};
const ficha: Ficha = {
  id: 'f-alba', personId: 'alba-gelabert', companyIds: [], employmentType: 'freelance', monthlyCost: 2000,
  hasAccount: true, active: true, birthDate: '1997-07-09', vacationDaysPerYear: 22,
};

describe('FichaDetailPanel', () => {
  it('renders badges and seeded data', () => {
    render(<FichaDetailPanel person={person} ficha={ficha} />);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByText('Con cuenta')).toBeInTheDocument();
    expect(screen.getByText('Activa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('09/07/1997')).toBeInTheDocument();
    expect(screen.getByDisplayValue('22')).toBeInTheDocument();
  });

  it('does not show unsaved banner initially', () => {
    render(<FichaDetailPanel person={person} ficha={ficha} />);
    expect(screen.queryByText('Cambios sin guardar')).toBeNull();
  });

  it('shows unsaved banner after editing', async () => {
    render(<FichaDetailPanel person={person} ficha={ficha} />);
    const nameInput = screen.getByDisplayValue('Alba Gelabert');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Alba');
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
  });

  it('placeholder tabs render En construcción', async () => {
    render(<FichaDetailPanel person={person} ficha={ficha} />);
    await userEvent.click(screen.getByRole('button', { name: 'Acceso y permisos' }));
    expect(screen.getByText('En construcción')).toBeInTheDocument();
  });
});
