import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ActionDetailPage } from './ActionDetailPage';

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
        responsible: 'Sin asignar',
        commissionPct: 20,
        includedInFee: true,
        budgetLines: [
          { id: 'bl1', description: 'Foto / Vídeo (Ana)', amount: 400, status: 'paid' },
          { id: 'bl2', description: 'Staff', amount: 140, status: 'pending-payment' },
          { id: 'bl3', description: 'Talent', amount: 1500, status: 'pending-payment' },
          { id: 'bl4', description: 'Talent', amount: 1500, status: 'proposed' },
        ],
      },
    ],
  }),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/etra/tareas/:actionId" element={<ActionDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ActionDetailPage', () => {
  it('renders the capture-exact breakdown figures', () => {
    renderAt('/etra/tareas/act1');
    expect(screen.getByText('Desglose de la activación')).toBeInTheDocument();
    expect(screen.getByText('10.000,00 €')).toBeInTheDocument(); // Budget
    expect(screen.getByText('8000,00 €')).toBeInTheDocument(); // Disponible
    expect(screen.getByText('4460,00 €')).toBeInTheDocument(); // Restante
    expect(screen.getByText(/Queda 4460,00 € de 8000,00 €/)).toBeInTheDocument();
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows a not-found state for unknown ids', () => {
    renderAt('/etra/tareas/nope');
    expect(screen.getByText('Acción no encontrada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a acciones/ })).toBeInTheDocument();
  });
});
