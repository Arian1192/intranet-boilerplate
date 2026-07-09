import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShowListItem } from './ShowListItem';
import type { ShowSummary } from '@/types';

const item: ShowSummary = {
  id: 'a1',
  title: 'Los Canarios @ FUEGO',
  date: '18 jul 2026',
  daysLeft: 9,
  badges: ['Contrato sin firmar', 'Falta firmante'],
};

describe('ShowListItem', () => {
  it('renders the list variant as a button with an urgency day badge and tags', () => {
    render(<ShowListItem item={item} />);
    expect(screen.getByRole('button')).toHaveClass('items-start', 'hover:bg-slate-50');
    expect(screen.getByText('D-9')).toHaveClass('bg-orange-100', 'text-orange-700');
    expect(screen.getByText('Los Canarios @ FUEGO')).toHaveClass('font-medium', 'text-slate-800');
    expect(screen.getByText('Contrato sin firmar')).toBeInTheDocument();
    expect(screen.getByText('18 jul 2026')).toBeInTheDocument();
  });

  it('colors the day badge amber in the mid range', () => {
    render(<ShowListItem item={{ ...item, daysLeft: 16 }} />);
    expect(screen.getByText('D-16')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders the upcoming variant with status and payment badges', () => {
    render(
      <ShowListItem
        item={{ ...item, daysLeft: 57, badges: ['Confirmado', 'No abonado'] }}
        variant="upcoming"
      />
    );
    expect(screen.getByText('D-57')).toHaveClass('bg-sky-100', 'text-sky-700');
    expect(screen.getByText('Confirmado')).toHaveClass('bg-sky-100', 'text-sky-700');
    const paid = screen.getByText('No abonado');
    expect(paid).toHaveClass('bg-slate-100', 'text-slate-600', 'hidden', 'sm:inline-block');
  });
});
