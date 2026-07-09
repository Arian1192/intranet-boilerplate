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

describe('SeedingPage — Influencers', () => {
  it('expands a card to reveal email and edit/delete actions', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Influencers' }));

    expect(screen.getByText('2 en el directorio')).toBeInTheDocument();
    expect(screen.getByText('IG · 245K')).toBeInTheDocument();
    expect(screen.queryByText('carlos.ruiz@example.com')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expandir Carlos Ruiz' }));
    expect(screen.getByText('carlos.ruiz@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('opens the influencer form modal in create and edit modes', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Influencers' }));

    fireEvent.click(screen.getByRole('button', { name: '+ Añadir influencer' }));
    expect(screen.getByText('Nuevo influencer')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    fireEvent.click(screen.getByRole('button', { name: 'Expandir Carlos Ruiz' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar influencer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Carlos Ruiz')).toBeInTheDocument();
  });
});

describe('SeedingPage — Reporte', () => {
  it('renders the six stat cards and the Alcance column', () => {
    render(<SeedingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Reporte' }));

    expect(screen.getByText('ENVÍOS')).toBeInTheDocument();
    expect(screen.getByText('RETORNO')).toBeInTheDocument();
    expect(screen.getByText('100%')).toHaveClass('text-emerald-600');
    expect(screen.getByText('2 de 2 publicados')).toBeInTheDocument();
    expect(screen.getByText('COSTE POR PUBLICACIÓN')).toBeInTheDocument();
    expect(screen.getByText('Alcance')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Exportar PDF' })).toBeInTheDocument();
  });
});
