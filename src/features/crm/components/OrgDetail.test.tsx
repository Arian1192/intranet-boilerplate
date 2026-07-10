import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrgDetail } from './OrgDetail';
import type { CrmOrg } from '../data/seed';

const org: CrmOrg = {
  id: 'o1', name: 'BMG', legalName: 'BMG RIGHTS SL', nif: 'B64730187', kind: 'Empresa',
  roles: ['Cliente'], email: 'laura@bmg.com', address: "C/ O'DONNELL 10, Madrid",
  worksWith: ['Etra Agency'], contacts: [], shippingAddresses: [],
};

describe('OrgDetail', () => {
  it('renders the org card, works-with chips and the three empty sections', () => {
    render(<OrgDetail org={org} />);
    expect(screen.getByRole('heading', { name: 'BMG' })).toHaveClass('text-lg', 'font-semibold');
    expect(screen.getByText('NIF: B64730187')).toBeInTheDocument();
    expect(screen.getByText('Etra Agency')).toHaveClass('bg-blue-600/10', 'text-blue-600');
    expect(screen.getByRole('button', { name: 'Modificar' })).toBeInTheDocument();
    expect(screen.getByText('PERSONAS DE CONTACTO')).toBeInTheDocument();
    expect(screen.getByText('Sin personas de contacto.')).toBeInTheDocument();
    expect(screen.getByText('DIRECCIONES DE ENVÍO')).toBeInTheDocument();
    expect(screen.getByText('PORTAL DE REPOSICIONES (CRUDA)')).toBeInTheDocument();
  });
});
