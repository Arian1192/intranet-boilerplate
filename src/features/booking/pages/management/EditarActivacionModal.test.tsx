import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EditarActivacionModal } from './EditarActivacionModal';
import { ACTIVACIONES } from '@/features/booking/data/management-activaciones';

/** Milan Torne: es la que el live enseñó, y su artista no tiene campañas. */
const MILAN = ACTIVACIONES[0];
/** Bizza: la única de las 31 con campaña asignada. */
const BIZZA = ACTIVACIONES.find((a) => a.campana)!;

function pintar(activacion = MILAN) {
  const onGuardar = vi.fn();
  const onCancelar = vi.fn();
  render(
    <EditarActivacionModal activacion={activacion} onGuardar={onGuardar} onCancelar={onCancelar} />
  );
  return { onGuardar, onCancelar };
}

describe('EditarActivacionModal — calco del live', () => {
  it('rotula los siete campos en el orden del live', () => {
    pintar();
    expect(
      screen.getByRole('heading', { name: 'Editar activación', level: 2 })
    ).toBeInTheDocument();
    expect([...document.querySelectorAll('label.mb-1')].map((l) => l.textContent)).toEqual([
      'Título',
      'Artista',
      'Tipo',
      'Fecha',
      'Hora (opcional)',
      'Campaña (de qué campaña forma parte)',
      'Descripción',
    ]);
  });

  it('trae los valores del registro, con la fecha en el `dp`', () => {
    pintar();
    expect(screen.getByLabelText('Título')).toHaveValue('"What it Do" single release - ');
    expect(screen.getByLabelText('Artista')).toHaveValue('Milan Torne');
    expect(screen.getByLabelText('Tipo')).toHaveValue('Release');
    expect(screen.getByText('10/09/2026')).toHaveClass('dp-lab');
  });

  it('la Descripción es la misma nota que la fila pinta tras el punto medio', () => {
    const abdon = ACTIVACIONES.find((a) => a.artista === 'Abdon' && a.nota)!;
    pintar(abdon);
    expect(screen.getByLabelText('Descripción')).toHaveValue('Activamos campaña de google ads');
  });

  it('la Hora viene vacía, como en las 31 de la captura', () => {
    pintar();
    expect(screen.getByLabelText('Hora (opcional)')).toHaveValue('');
    expect(screen.getByLabelText('Hora (opcional)')).toHaveAttribute('maxlength', '5');
  });

  it('sin campañas del artista, el live añade su pista bajo el desplegable', () => {
    pintar();
    expect(screen.getByText('Este artista no tiene campañas todavía.')).toBeInTheDocument();
  });

  it('con campañas del artista, ofrece las suyas y no pinta la pista', () => {
    pintar(BIZZA);
    const campana = screen.getByLabelText(/^Campaña/) as HTMLSelectElement;
    expect([...campana.options].map((o) => o.text)).toEqual([
      '— Sin campaña —',
      'Campaña general Bizza',
    ]);
    expect(campana).toHaveValue('Campaña general Bizza');
    expect(screen.queryByText('Este artista no tiene campañas todavía.')).not.toBeInTheDocument();
  });

  it('no trae botón de borrar: en Activaciones se elimina desde la fila', () => {
    pintar();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveClass('btn-secondary');
    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveClass('btn-primary');
  });

  it('Guardar devuelve el borrador; Cancelar no guarda', async () => {
    const usuario = userEvent.setup();
    const { onGuardar, onCancelar } = pintar();
    await usuario.selectOptions(screen.getByLabelText('Tipo'), 'Show');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'Show' }));
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it('Guardar se deshabilita si el título se queda vacío', async () => {
    const usuario = userEvent.setup();
    pintar();
    await usuario.clear(screen.getByLabelText('Título'));
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });
});
