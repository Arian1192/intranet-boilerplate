import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciaStatFilter } from './IncidenciaStatFilter';

describe('IncidenciaStatFilter', () => {
  it('con count>0 sin seleccionar: borde normal, badge de acento, número oscuro', () => {
    render(<IncidenciaStatFilter estado="nueva" label="NUEVAS" count={1} selected={false} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /NUEVAS/ });
    expect(btn).toHaveClass('border-slate-200', 'bg-white');
    expect(screen.getByText('NUEVAS')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(screen.getByText('1')).toHaveClass('text-slate-900');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('con count=0 sin seleccionar: atenuada (borde y badge distintos) — caso EN CURSO', () => {
    render(<IncidenciaStatFilter estado="en_curso" label="EN CURSO" count={0} selected={false} onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /EN CURSO/ });
    expect(btn).toHaveClass('border-slate-100', 'bg-slate-50/60');
    expect(screen.getByText('EN CURSO')).toHaveClass('bg-transparent', 'text-slate-300');
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
  });

  it('seleccionada: borde y fondo de selección, aria-pressed true; con count=0 el badge sigue atenuado', () => {
    render(<IncidenciaStatFilter estado="en_curso" label="EN CURSO" count={0} selected onToggle={() => {}} />);
    const btn = screen.getByRole('button', { name: /EN CURSO/ });
    expect(btn).toHaveClass('border-slate-800', 'bg-white', 'shadow-sm');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('EN CURSO')).toHaveClass('bg-transparent', 'text-slate-300');
  });

  it('dispara onToggle al click', async () => {
    const onToggle = vi.fn();
    render(<IncidenciaStatFilter estado="resuelta" label="RESUELTAS" count={2} selected={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /RESUELTAS/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
