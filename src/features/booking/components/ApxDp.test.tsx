import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ApxDp } from './ApxDp';

function pintar(valor: string | null = '2026-09-17') {
  const onCambio = vi.fn();
  render(<ApxDp valor={valor} onCambio={onCambio} />);
  return onCambio;
}

const abrir = async () => {
  const usuario = userEvent.setup();
  await usuario.click(screen.getByRole('button'));
};

describe('ApxDp — el selector de fecha de la carcasa apx', () => {
  it('cerrado, escribe la fecha en dd/mm/aaaa con las clases de apx.css', () => {
    pintar();
    const boton = screen.getByRole('button');
    expect(boton).toHaveClass('dp-btn');
    expect(boton.parentElement).toHaveClass('dp');
    expect(screen.getByText('17/09/2026')).toHaveClass('dp-lab');
    expect(screen.getByText('17/09/2026')).not.toHaveClass('ph');
  });

  it('sin fecha pinta el placeholder del live con la clase `ph`', () => {
    pintar(null);
    expect(screen.getByText('dd/mm/aaaa')).toHaveClass('dp-lab', 'ph');
  });

  it('la cabecera dice «septiembre 2026», sin el «de» que pondría Intl', async () => {
    pintar();
    await abrir();
    expect(document.querySelector('.dp-head b')?.textContent).toBe('septiembre 2026');
  });

  it('la semana empieza en lunes y el miércoles es X', async () => {
    pintar();
    await abrir();
    expect([...document.querySelectorAll('.dp-dow span')].map((s) => s.textContent)).toEqual([
      'L',
      'M',
      'X',
      'J',
      'V',
      'S',
      'D',
    ]);
  });

  it('septiembre de 2026 empieza en martes: un hueco `mut` y 30 días', async () => {
    pintar();
    await abrir();
    expect(document.querySelectorAll('.dp-grid .dp-day.mut')).toHaveLength(1);
    expect(document.querySelectorAll('.dp-grid button.dp-day')).toHaveLength(30);
    expect(screen.getByRole('button', { name: '17' })).toHaveClass('sel');
  });

  it('elegir un día lo devuelve en ISO y cierra el calendario', async () => {
    const usuario = userEvent.setup();
    const onCambio = pintar();
    await abrir();
    await usuario.click(screen.getByRole('button', { name: '3' }));
    expect(onCambio).toHaveBeenCalledWith('2026-09-03');
    expect(document.querySelector('.dp-pop')).toBeNull();
  });

  it('«Borrar fecha» devuelve null', async () => {
    const usuario = userEvent.setup();
    const onCambio = pintar();
    await abrir();
    await usuario.click(screen.getByRole('button', { name: 'Borrar fecha' }));
    expect(onCambio).toHaveBeenCalledWith(null);
  });

  it('las flechas cambian de mes sin tocar el valor', async () => {
    const usuario = userEvent.setup();
    const onCambio = pintar();
    await abrir();
    await usuario.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(document.querySelector('.dp-head b')?.textContent).toBe('agosto 2026');
    await usuario.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    await usuario.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(document.querySelector('.dp-head b')?.textContent).toBe('octubre 2026');
    expect(onCambio).not.toHaveBeenCalled();
  });

  it('se cierra con Escape', async () => {
    const usuario = userEvent.setup();
    pintar();
    await abrir();
    expect(document.querySelector('.dp-pop')).not.toBeNull();
    await usuario.keyboard('{Escape}');
    expect(document.querySelector('.dp-pop')).toBeNull();
  });
});
