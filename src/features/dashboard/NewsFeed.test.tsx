import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewsFeed } from './NewsFeed';
import type { NewsItem } from '@/types';

const items: NewsItem[] = [
  { id: 'n1', author: 'Ana', scope: 'Grupo', date: '05 jul 2026', title: 'Primera novedad', content: 'A' },
  { id: 'n2', author: 'Ana', scope: 'Grupo', date: '04 jul 2026', title: 'Segunda novedad', content: 'B' },
];

describe('NewsFeed', () => {
  it('renders one card per item', () => {
    render(<NewsFeed items={items} />);
    expect(screen.getByText('Primera novedad')).toBeInTheDocument();
    expect(screen.getByText('Segunda novedad')).toBeInTheDocument();
  });

  it('toggles the inline form with the + button', () => {
    render(<NewsFeed items={items} />);
    expect(screen.queryByText('¿Cuándo se publica?')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir novedad' }));
    expect(screen.getByText('¿Cuándo se publica?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('¿Cuándo se publica?')).not.toBeInTheDocument();
  });
});
