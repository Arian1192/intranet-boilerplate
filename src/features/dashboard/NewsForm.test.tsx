import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewsForm } from './NewsForm';

describe('NewsForm', () => {
  it('renders the timing segmented control and publish timing options', () => {
    render(<NewsForm onClose={() => {}} />);
    expect(screen.getByText('¿Cuándo se publica?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ahora' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Programar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrador' })).toBeInTheDocument();
  });

  it('calls onClose when Publicar or Cancelar is clicked', () => {
    const onClose = vi.fn();
    render(<NewsForm onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
