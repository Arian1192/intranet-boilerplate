import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StageBox } from './StageBox';

describe('StageBox', () => {
  it('muestra label y contador; con count>0 resalta el número', () => {
    render(<StageBox label="ACEPTADA" count={1} tone="emerald" />);
    expect(screen.getByText('ACEPTADA')).toHaveClass('text-emerald-600');
    expect(screen.getByText('1')).toHaveClass('text-slate-800');
  });

  it('muestra el importe formateado cuando se pasa', () => {
    render(<StageBox label="ACEPTADA" count={1} amount="1.500,00 €" tone="emerald" />);
    expect(screen.getByText('1.500,00 €')).toBeInTheDocument();
  });

  it('con count 0 atenúa y no muestra importe', () => {
    render(<StageBox label="TENTATIVA" count={0} tone="slate" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('es button con aria-pressed y dispara onClick', async () => {
    const onClick = vi.fn();
    render(<StageBox label="ACEPTADA" count={1} tone="emerald" selected onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /ACEPTADA/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
