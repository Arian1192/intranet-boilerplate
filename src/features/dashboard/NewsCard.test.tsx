import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewsCard } from './NewsCard';
import type { NewsItem } from '@/types';

const item: NewsItem = {
  id: 'n1',
  author: 'Ana López',
  scope: 'Grupo',
  date: '05 jul 2026',
  title: 'Teletrabajo hasta el 7 de julio incluido',
  content: 'Detalle completo de la novedad.',
};

describe('NewsCard', () => {
  it('renders the title with semibold weight and hides content when collapsed', () => {
    render(<NewsCard item={item} />);
    expect(screen.getByText(item.title)).toHaveClass('font-semibold');
    expect(screen.queryByText('Detalle completo de la novedad.')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('reveals content and Editar/Eliminar when the chevron is clicked', () => {
    render(<NewsCard item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(screen.getByText('Detalle completo de la novedad.')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Colapsar' })).toBeInTheDocument();
  });
});
