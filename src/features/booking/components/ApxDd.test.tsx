import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ApxDd } from './ApxDd';

const OPCIONES = ['Google Ads', 'Meta Ads', 'Otro'];

function pintar(valor: string | null = null, onCambio = vi.fn()) {
  render(
    <ApxDd
      todas="Todos los canales"
      opciones={OPCIONES}
      valor={valor}
      onCambio={onCambio}
      ancho="w-44"
    />
  );
  return onCambio;
}

describe('ApxDd — el desplegable de la carcasa apx', () => {
  it('arranca cerrado, rotulado con el «todas» y con las clases de apx.css', () => {
    pintar();
    const boton = screen.getByRole('button', { name: 'Todos los canales' });
    expect(boton).toHaveClass('dd-btn');
    expect(boton).toHaveAttribute('aria-expanded', 'false');
    expect(boton.parentElement).toHaveClass('dd', 'w-44');
    expect(boton.parentElement).not.toHaveClass('open');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('al abrirlo lista el «todas» y las opciones, y marca la elegida con sel', async () => {
    const usuario = userEvent.setup();
    pintar('Meta Ads');
    await usuario.click(screen.getByRole('button', { name: 'Meta Ads' }));
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Todos los canales',
      ...OPCIONES,
    ]);
    const elegida = screen.getByRole('option', { name: 'Meta Ads' });
    expect(elegida).toHaveClass('dd-opt', 'sel');
    expect(elegida).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Meta Ads' }).parentElement).toHaveClass('open');
  });

  it('elegir una opción la devuelve y cierra el menú', async () => {
    const usuario = userEvent.setup();
    const onCambio = pintar();
    await usuario.click(screen.getByRole('button', { name: 'Todos los canales' }));
    await usuario.click(screen.getByRole('option', { name: 'Otro' }));
    expect(onCambio).toHaveBeenCalledWith('Otro');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('elegir el «todas» devuelve null, que es «sin filtrar»', async () => {
    const usuario = userEvent.setup();
    const onCambio = pintar('Otro');
    await usuario.click(screen.getByRole('button', { name: 'Otro' }));
    await usuario.click(screen.getByRole('option', { name: 'Todos los canales' }));
    expect(onCambio).toHaveBeenCalledWith(null);
  });

  it('se cierra con Escape y pulsando fuera', async () => {
    const usuario = userEvent.setup();
    pintar();
    await usuario.click(screen.getByRole('button', { name: 'Todos los canales' }));
    await usuario.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Todos los canales' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await usuario.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
