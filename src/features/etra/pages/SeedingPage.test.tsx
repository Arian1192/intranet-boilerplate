import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SeedingPage } from './SeedingPage';

vi.mock('../hooks/useInventory', () => ({
  useInventory: () => ({
    isLoading: false,
    error: null,
    data: [{ id: 'inv1', name: 'Gorra Edición Limitada', variant: '8 · Rojo', ref: 'REF-0001', quantity: 6 }],
  }),
}));
vi.mock('../hooks/useDeliveries', () => ({
  useDeliveries: () => ({
    isLoading: false,
    error: null,
    data: [
      { id: 'del1', date: '07 jul 2026', account: 'Cliente A', method: 'internal', status: 'delivered', published: false, recipient: 'Ana López', itemsSummary: '1× Gorra Edición Limitada · 8', piecesCount: 1, cost: 0 },
      { id: 'del2', date: '07 jul 2026', account: 'Cliente A', method: 'mrw', status: 'delivered', published: true, recipient: 'Carlos Ruiz', itemsSummary: '2× Gorra Edición Limitada · 8', piecesCount: 2, cost: 0 },
      { id: 'del3', date: '06 jul 2026', account: 'Cliente A', method: 'mrw', status: 'delivered', published: true, recipient: 'Carlos Ruiz', itemsSummary: '1× Gorra Edición Limitada · 8', piecesCount: 1, cost: 0 },
    ],
  }),
}));
vi.mock('../hooks/useInfluencers', () => ({
  useInfluencers: () => ({
    isLoading: false,
    error: null,
    data: [
      { id: 'inf1', name: 'Carlos Ruiz', initials: 'CR', instagramFollowers: 245000, tiktokFollowers: 26200, email: 'carlos.ruiz@example.com' },
      { id: 'inf2', name: 'María García', initials: 'MG', instagramFollowers: 335000 },
    ],
  }),
}));
vi.mock('../hooks/useSeedingReport', () => ({
  useSeedingReport: () => ({
    isLoading: false,
    error: null,
    data: [
      { date: '07 jul 2026', influencer: 'Carlos Ruiz', pieces: 2, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
      { date: '06 jul 2026', influencer: 'Carlos Ruiz', pieces: 1, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
    ],
  }),
}));

describe('SeedingPage — Entregas', () => {
  it('shows the stats line and delivery rows on the Entregas tab', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));

    expect(screen.getByText('3')).toBeInTheDocument(); // entregas count
    expect(screen.getByText(/100%/)).toBeInTheDocument(); // retorno
    expect(screen.getByText('Uso interno')).toBeInTheDocument();
    expect(screen.getAllByText('Envío MRW').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Publicado').length).toBe(2);
  });

  it('opens the Nueva entrega modal and switches fields per method', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva entrega' }));

    expect(screen.getByText('Nueva entrega')).toBeInTheDocument();
    expect(screen.getByText('Transportista')).toBeInTheDocument(); // MRW default

    fireEvent.click(screen.getByRole('button', { name: 'Uso interno' }));
    expect(screen.queryByText('Transportista')).not.toBeInTheDocument();
    expect(screen.getByText('¿Quién se lo queda? *')).toBeInTheDocument();
  });
});
