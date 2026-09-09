import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EditarCampanaModal } from './EditarCampanaModal';
import { CAMPANAS } from '@/features/booking/data/management-campanas';

const ABDON = CAMPANAS[0]; // «Campaña de aumento de suscriptores en YouTube»

function pintar(campana = ABDON) {
  const onGuardar = vi.fn();
  const onCancelar = vi.fn();
  const onEliminar = vi.fn();
  render(
    <EditarCampanaModal
      campana={campana}
      todas={CAMPANAS}
      onGuardar={onGuardar}
      onCancelar={onCancelar}
      onEliminar={onEliminar}
    />
  );
  return { onGuardar, onCancelar, onEliminar };
}

describe('EditarCampanaModal — calco del live', () => {
  it('rotula los trece campos en el orden del live', () => {
    pintar();
    expect(screen.getByRole('heading', { name: 'Editar campaña', level: 2 })).toBeInTheDocument();
    const rotulos = [...document.querySelectorAll('label.mb-1')].map((l) => l.textContent);
    expect(rotulos).toEqual([
      'Nombre',
      'Artista',
      'Estrategia (a qué plan pertenece)',
      'Campaña madre (opcional)',
      'Canal',
      'Estado',
      'Paga',
      'Objetivo',
      'Presupuesto (€)',
      'Gasto real (€)',
      'Inicio',
      'Fin',
      'Notas',
    ]);
  });

  it('trae los valores del registro que se edita', () => {
    pintar();
    expect(screen.getByLabelText('Nombre')).toHaveValue(
      'Campaña de aumento de suscriptores en YouTube'
    );
    expect(screen.getByLabelText('Artista')).toHaveValue('Abdon');
    expect(screen.getByLabelText(/^Estrategia/)).toHaveValue('Plan de Crecimiento Redes');
    expect(screen.getByLabelText('Canal')).toHaveValue('Otro');
    expect(screen.getByLabelText('Estado')).toHaveValue('Aprobada');
    expect(screen.getByLabelText('Objetivo')).toHaveValue('Aumentar suscriptores hasta 1K mínimo');
    expect(screen.getByLabelText('Presupuesto (€)')).toHaveValue(75);
  });

  it('las fechas usan el `dp` de la carcasa y se escriben dd/mm/aaaa', () => {
    pintar();
    // `17/09/2026` es el literal medido en el modal del live para esta campaña.
    expect(screen.getByText('17/09/2026')).toHaveClass('dp-lab');
    expect(screen.getByText('01/10/2026')).toHaveClass('dp-lab');
  });

  it('la estrategia ofrece sólo las del artista, y cambia al cambiar de artista', async () => {
    const usuario = userEvent.setup();
    pintar();
    const estrategia = screen.getByLabelText(/^Estrategia/) as HTMLSelectElement;
    expect([...estrategia.options].map((o) => o.text)).toEqual([
      '— Sin estrategia —',
      'Plan de Crecimiento Redes',
    ]);
    await usuario.selectOptions(screen.getByLabelText('Artista'), 'Gaston Zani');
    expect([...estrategia.options].map((o) => o.text)).toEqual([
      '— Sin estrategia —',
      'Lanzamiento Marca Nueva "Aktivo"',
      'Más bookings en EU',
    ]);
  });

  it('la campaña madre ofrece las otras campañas del artista, nunca la que se edita', () => {
    pintar();
    const madre = screen.getByLabelText('Campaña madre (opcional)') as HTMLSelectElement;
    // `HTMLOptionElement.text` recorta los extremos, así que el espacio final
    // del nombre de la campaña de COVA SANTA no aparece aquí. El volcado del
    // live sale igual por el mismo motivo; el dato lo conserva.
    expect([...madre.options].map((o) => o.text)).toEqual([
      '— Ninguna (es principal) —',
      'Campaña de Views en YouTube set COVA SANTA',
      'Campaña de aumento de seguidores - Meta (Instagram)',
    ]);
    expect([...madre.options].map((o) => o.value)).toContain(
      'Campaña de Views en YouTube set COVA SANTA '
    );
  });

  it('Guardar devuelve el borrador con los cambios', async () => {
    const usuario = userEvent.setup();
    const { onGuardar } = pintar();
    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Activa');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({ estado: 'Activa' }));
  });

  it('Guardar se deshabilita si el nombre se queda vacío', async () => {
    const usuario = userEvent.setup();
    pintar();
    await usuario.clear(screen.getByLabelText('Nombre'));
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });

  it('Cancelar y el aspa avisan sin guardar; Eliminar avisa aparte', async () => {
    const usuario = userEvent.setup();
    const { onCancelar, onGuardar, onEliminar } = pintar();
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    await usuario.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCancelar).toHaveBeenCalledTimes(2);
    expect(onGuardar).not.toHaveBeenCalled();
    await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onEliminar).toHaveBeenCalledTimes(1);
  });

  it('usa select nativo con la clase del live, no el desplegable `dd`', () => {
    pintar();
    expect(screen.getByLabelText('Canal')).toHaveClass('input', 'h-9', 'w-full');
    expect(document.querySelector('.dd')).toBeNull();
  });
});
