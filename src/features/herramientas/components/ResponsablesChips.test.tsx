import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponsablesChips } from './ResponsablesChips';

const responsables = [
  { id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' },
  { id: 'resp-tony', nombre: 'Tony', iniciales: 'TC' },
];

describe('ResponsablesChips', () => {
  it('renders a chip per responsable and the inert "＋ Añadir" button', () => {
    render(<ResponsablesChips responsables={responsables} onRemove={vi.fn()} />);
    expect(screen.getByText('Jack')).toBeInTheDocument();
    expect(screen.getByText('Tony')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '＋ Añadir' })).toBeInTheDocument();
  });

  it('calls onRemove with the responsable id', async () => {
    const onRemove = vi.fn();
    render(<ResponsablesChips responsables={responsables} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Jack' }));
    expect(onRemove).toHaveBeenCalledWith('resp-jack');
  });
});
