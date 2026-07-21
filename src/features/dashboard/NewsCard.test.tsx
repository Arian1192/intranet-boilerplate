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
  it('renders the title with medium weight and the scope as a pill; hides content when collapsed', () => {
    render(<NewsCard item={item} />);
    expect(screen.getByText(item.title)).toHaveClass('font-medium');
    expect(screen.getByText('Grupo')).toHaveClass('rounded-full');
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

  it('reveals content when the title button is clicked', () => {
    render(<NewsCard item={item} />);
    fireEvent.click(screen.getByText(item.title));
    expect(screen.getByText('Detalle completo de la novedad.')).toBeInTheDocument();
  });

  it('muestra el botón de acción en la fila (colapsada) sin acentos brand', () => {
    render(
      <NewsCard
        item={{
          id: '1',
          author: 'Carlos Pego',
          scope: 'Grupo',
          date: '20 jul 2026',
          title: 'Black Moose Summer Lunch',
          actionLabel: 'Confirmar Asistencia',
        }}
      />
    );
    const btn = screen.getByRole('button', { name: 'Confirmar Asistencia' });
    expect(btn.className).not.toMatch(/brand/);
  });
});
