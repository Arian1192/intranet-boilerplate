import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookerCommissionRow } from './BookerCommissionRow';

describe('BookerCommissionRow', () => {
  it('muestra nombre, input con el % y "(global X%)"', () => {
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
  });

  it('editar el input dispara onChange con el número', async () => {
    const onChange = vi.fn();
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={onChange} />);
    const input = screen.getByDisplayValue('25');
    await userEvent.clear(input);
    await userEvent.type(input, '30');
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('recalcula "(global X%)" cuando cambia el globalPercent recibido', () => {
    const { rerender } = render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
    rerender(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={30} onChange={() => {}} />);
    expect(screen.getByText('(global 30%)')).toBeInTheDocument();
  });
});
