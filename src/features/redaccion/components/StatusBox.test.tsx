import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusBox } from './StatusBox';

describe('StatusBox', () => {
  it('muestra label y contador; con count>0 resalta el número', () => {
    render(<StatusBox label="BORRADOR" count={3} tone="slate" />);
    expect(screen.getByText('BORRADOR')).toBeInTheDocument();
    const n = screen.getByText('3');
    expect(n).toHaveClass('text-slate-800');
  });

  it('con count 0 atenúa el número', () => {
    render(<StatusBox label="APROBADO" count={0} tone="slate" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('es un button con aria-pressed reflejando selected y dispara onClick', async () => {
    const onClick = vi.fn();
    render(<StatusBox label="IDEA" count={1} tone="plain" selected onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /IDEA/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
