import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EditarProyectoModal } from './EditarProyectoModal';
import { PROYECTOS_CONTENT } from '@/features/booking/data/management-content';

function pintar(proyecto = PROYECTOS_CONTENT[0]) {
  const onGuardar = vi.fn();
  const onCancelar = vi.fn();
  render(<EditarProyectoModal proyecto={proyecto} onGuardar={onGuardar} onCancelar={onCancelar} />);
  return { onGuardar, onCancelar };
}

describe('EditarProyectoModal — calco del live', () => {
  it('rotula sus campos en el orden del live', () => {
    pintar();
    expect(screen.getByRole('heading', { name: 'Editar proyecto', level: 2 })).toBeInTheDocument();
    expect([...document.querySelectorAll('label.mb-1')].map((l) => l.textContent)).toEqual([
      'Título',
      'Artista',
      'Tipo',
      'Fase',
      'Producido por',
      'Campaña (de qué campaña forma parte)',
      'Brief',
      'Presup. cotizado (€)',
      'Aprobado (€)',
      'Real (€)',
      'Paga',
      'Brief enviado',
      'Entrega prevista',
      'Notas',
    ]);
  });

  it('trae las tres casillas del live, las tres desmarcadas', () => {
    pintar();
    for (const rotulo of ['Proveedor externo', 'Recuperable', 'Aprobado']) {
      expect(screen.getByLabelText(rotulo)).not.toBeChecked();
    }
  });

  it('trae los valores del único proyecto del live', () => {
    pintar();
    expect(screen.getByLabelText('Título')).toHaveValue('8bit Release promo video "LIFESTYLE"');
    expect(screen.getByLabelText('Artista')).toHaveValue('Londonground');
    expect(screen.getByLabelText('Tipo')).toHaveValue('Vídeo');
    expect(screen.getByLabelText('Fase')).toHaveValue('Idea');
    expect(screen.getByLabelText('Producido por')).toHaveValue('ConceptOne');
    expect(screen.getByLabelText('Paga')).toHaveValue('Artista');
  });

  it('los tres importes y los dos textos largos vienen vacíos, como en el live', () => {
    pintar();
    for (const rotulo of ['Presup. cotizado (€)', 'Aprobado (€)', 'Real (€)']) {
      expect(screen.getByLabelText(rotulo)).toHaveValue(null);
    }
    expect(screen.getByLabelText('Brief')).toHaveValue('');
    expect(screen.getByLabelText('Notas')).toHaveValue('');
  });

  it('las dos fechas vacías pintan el `dp` en placeholder, con la clase `ph`', () => {
    pintar();
    const vacios = screen.getAllByText('dd/mm/aaaa');
    expect(vacios).toHaveLength(2);
    for (const v of vacios) expect(v).toHaveClass('dp-lab', 'ph');
  });

  it('el artista no tiene campañas, así que sólo ofrece «— Sin campaña —»', () => {
    pintar();
    const campana = screen.getByLabelText(/^Campaña/) as HTMLSelectElement;
    expect([...campana.options].map((o) => o.text)).toEqual(['— Sin campaña —']);
  });

  it('no trae botón de borrar: en Content se elimina desde la tarjeta', () => {
    pintar();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  });

  it('Guardar devuelve el borrador con las casillas y la fase cambiadas', async () => {
    const usuario = userEvent.setup();
    const { onGuardar } = pintar();
    await usuario.click(screen.getByLabelText('Recuperable'));
    await usuario.selectOptions(screen.getByLabelText('Fase'), 'Producción');
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onGuardar).toHaveBeenCalledWith(
      expect.objectContaining({ recuperable: true, fase: 'Producción' })
    );
  });

  it('Guardar se deshabilita si el título se queda vacío', async () => {
    const usuario = userEvent.setup();
    pintar();
    await usuario.clear(screen.getByLabelText('Título'));
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });
});
