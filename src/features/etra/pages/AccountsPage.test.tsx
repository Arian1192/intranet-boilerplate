import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountsPage } from './AccountsPage';

const accounts = [
  {
    id: 'acc1',
    name: 'Cliente A',
    status: 'active',
    manager: 'Ana López',
    crmClient: 'Cliente A',
    contact: 'Jack Contacto',
    signupDate: '01 ene 2026',
    email: 'contacto@cliente-a.example.com',
    phone: '+34 600 000 001',
    obligations: [
      { id: 'ob1', label: 'Notas de prensa', cadence: 'Mensual', period: '2026-07', done: 0, target: 4 },
    ],
    coverage: [
      { id: 'cov1', date: '08 jul 2026', title: 'Mención en medios', outlet: 'Prensa Digital', channel: 'Online', value: 1000 },
    ],
    billing: {
      defaultRetainer: 5500,
      defaultCommissionPct: 20,
      months: [
        { id: 'm7', label: 'Jul 2026', retainer: 5500, commissions: 2000, others: 0 },
        { id: 'm6', label: 'Jun 2026', retainer: 5500, commissions: null, others: 0 },
      ],
    },
  },
];

vi.mock('../hooks/usePrAccounts', () => ({
  usePrAccounts: () => ({ isLoading: false, error: null, data: accounts }),
}));
vi.mock('../hooks/usePrActions', () => ({
  usePrActions: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
      },
    ],
  }),
}));

describe('AccountsPage', () => {
  it('shows the Nueva cuenta form and returns to browse on cancel', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva cuenta' }));

    expect(screen.getByText('Nueva cuenta')).toBeInTheDocument();
    expect(screen.getByText('Nombre (marca) *')).toBeInTheDocument();
    expect(screen.getByText('Abrir CRM ↗')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Selecciona una cuenta o crea una nueva.')).toBeInTheDocument();
  });

  it('selects an account and shows the underline detail tabs with Datos', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);

    expect(screen.getByRole('button', { name: 'Obligaciones' })).toBeInTheDocument();
    expect(screen.getByText('Ana López')).toBeInTheDocument(); // Datos tab content
    expect(screen.getByText('contacto@cliente-a.example.com')).toBeInTheDocument();
  });
});

describe('AccountsPage — detail tabs (Acciones, Obligaciones)', () => {
  it('renders the per-account action form and list', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Acciones' }));

    expect(screen.getByText('Título de la acción')).toBeInTheDocument();
    expect(screen.getByText('Incluida en fee')).toBeInTheDocument();
    expect(screen.getByText('Acción de prensa Cliente A')).toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('renders obligations with a progress bar and target', () => {
    render(<AccountsPage />);
    fireEvent.click(screen.getAllByText('Cliente A')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Obligaciones' }));

    expect(screen.getByText('KPIS / OBLIGACIONES')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Modificar obligaciones' })).toBeInTheDocument();
    expect(screen.getByText('Notas de prensa')).toBeInTheDocument();
    expect(screen.getByText('Mensual · 2026-07')).toBeInTheDocument();
    expect(screen.getByText('/ 4')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
