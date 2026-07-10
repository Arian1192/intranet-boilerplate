import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  it('renders all 7 filters and marks the active one', () => {
    render(<FilterChips active="Todas" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveClass('bg-brand-600', 'text-white');
    expect(screen.getByRole('button', { name: 'Vídeo' })).toHaveClass('bg-slate-100', 'text-slate-600');
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });

  it('calls onChange with the clicked filter', () => {
    const onChange = vi.fn();
    render(<FilterChips active="Todas" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Atrasadas' }));
    expect(onChange).toHaveBeenCalledWith('Atrasadas');
  });
});
