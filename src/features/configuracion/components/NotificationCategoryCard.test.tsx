import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationCategoryCard } from './NotificationCategoryCard';
import { categories, recipientsFor } from '../data/notificaciones';

describe('NotificationCategoryCard', () => {
  it('categoría con toggle de email: 15 filas, columna email visible', () => {
    const cat = categories().find((c) => c.id === 'pedidos_reposicion')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    expect(screen.getByText('Pedidos de reposición (portal)')).toBeInTheDocument();
    expect(screen.getAllByText('también por email')).toHaveLength(15);
  });

  it('categoría sin toggle (vacaciones): columna email ausente', () => {
    const cat = categories().find((c) => c.id === 'vacaciones')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    expect(screen.queryByText('también por email')).toBeNull();
  });

  it('checkbox secundario deshabilitado si el principal no está marcado', () => {
    const cat = categories().find((c) => c.id === 'pedidos_reposicion')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    const albaRow = screen.getByText('Alba Gelabert').closest('div')!;
    const emailCheckbox = within(albaRow).getByText('también por email').closest('label')!.querySelector('input')!;
    expect(emailCheckbox).toBeDisabled();
  });

  it('togglear el checkbox principal llama a onToggle con el userName', async () => {
    const onToggle = vi.fn();
    const cat = categories().find((c) => c.id === 'vacaciones')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={onToggle} onToggleEmail={() => {}} />);
    const checkbox = screen.getByText('Alba Gelabert').closest('label')!.querySelector('input')!;
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('Alba Gelabert');
  });
});
