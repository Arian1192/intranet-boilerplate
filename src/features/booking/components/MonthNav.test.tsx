import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MonthNav } from './MonthNav';

describe('MonthNav', () => {
  it('muestra el mes/año y dispara onPrev/onNext', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<MonthNav year={2026} month={6} onPrev={onPrev} onNext={onNext} />);
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });
});
