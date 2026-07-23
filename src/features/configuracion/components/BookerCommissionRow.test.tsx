import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BookerCommissionRow } from './BookerCommissionRow';

describe('BookerCommissionRow', () => {
  it('muestra nombre, input con el % y "(global X%)"', () => {
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
  });

  it('editar el input dispara onChange con el número', () => {
    const onChange = vi.fn();
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('25'), { target: { value: '30' } });
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('recalcula "(global X%)" cuando cambia el globalPercent recibido', () => {
    const { rerender } = render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
    rerender(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={30} onChange={() => {}} />);
    expect(screen.getByText('(global 30%)')).toBeInTheDocument();
  });
});
