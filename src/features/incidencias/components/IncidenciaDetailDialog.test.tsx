import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciaDetailDialog } from './IncidenciaDetailDialog';
import { listIncidencias } from '../data/incidencias';

const seed = listIncidencias();
const sinTriaje = seed[0]; // Fran Hinojosa Veredas, sin adjunto, sin triaje, sin respuesta
const conTodo = seed[1]; // Alba Gelabert, adjunto + triaje 'fallo' + respuesta

describe('IncidenciaDetailDialog', () => {
  it('cabecera: badge de estado, avatar del reportante, nombre y el separador "· —"', () => {
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('DESCARTADAS')).toHaveClass('bg-slate-100', 'text-slate-500');
    expect(within(dialog).getByLabelText('Fran Hinojosa Veredas')).toBeInTheDocument();
    expect(within(dialog).getByText('Fran Hinojosa Veredas')).toBeInTheDocument();
    expect(within(dialog).getByText('· —')).toBeInTheDocument();
  });

  it('cuerpo: muestra el texto ÍNTEGRO respetando saltos de línea', () => {
    render(<IncidenciaDetailDialog incidencia={conTodo} onClose={() => {}} />);
    const parrafo = screen.getByText(/No funciona la generción de copys por iA/);
    expect(parrafo).toHaveClass('whitespace-pre-wrap');
    expect(parrafo.textContent).toBe(conTodo.texto);
  });

  it('"Contexto técnico" es un details con el snapshot serializado como JSON', async () => {
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={() => {}} />);
    expect(screen.getByText('Contexto técnico')).toBeInTheDocument();
    const pre = screen.getByTestId('contexto-tecnico');
    expect(pre.tagName).toBe('PRE');
    const parsed = JSON.parse(pre.textContent ?? '{}');
    expect(parsed.ruta).toBe('/');
    expect(parsed.ventana).toBe('1920×992');
    expect(parsed.conversacion).toHaveLength(1);
    expect(parsed.errores_consola).toEqual([]);
  });

  it('bloque de triaje: chip de categoría, hipótesis y nota de especulación', () => {
    render(<IncidenciaDetailDialog incidencia={conTodo} onClose={() => {}} />);
    expect(screen.getByText('Hipótesis del triaje')).toBeInTheDocument();
    expect(screen.getByText('fallo')).toBeInTheDocument();
    expect(screen.getByText(/dos son ideas de mejora/)).toBeInTheDocument();
    expect(
      screen.getByText('Especulación: el triaje no lee el código, solo el manual y el contexto.')
    ).toBeInTheDocument();
  });

  it('sin triaje no se renderiza el bloque de hipótesis', () => {
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={() => {}} />);
    expect(screen.queryByText('Hipótesis del triaje')).toBeNull();
  });

  it('Respuesta: textarea con el placeholder del live, precargada cuando ya se contestó', () => {
    render(<IncidenciaDetailDialog incidencia={conTodo} onClose={() => {}} />);
    const ta = screen.getByRole('textbox');
    expect(ta).toHaveAttribute('placeholder', 'Qué era, qué has hecho. Se le manda al que lo reportó.');
    expect(ta).toHaveValue(conTodo.respuesta);
  });

  it('Respuesta vacía cuando nadie ha contestado, y es escribible en local', async () => {
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={() => {}} />);
    const ta = screen.getByRole('textbox');
    expect(ta).toHaveValue('');
    await userEvent.type(ta, 'hola');
    expect(ta).toHaveValue('hola');
  });

  it('pie: Descartar, En curso y Resuelta, presentes pero inertes (acción no explorada en el live)', async () => {
    const onClose = vi.fn();
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={onClose} />);
    for (const nombre of ['Descartar', 'En curso', 'Resuelta']) {
      const btn = screen.getByRole('button', { name: nombre });
      expect(btn).toBeInTheDocument();
      await userEvent.click(btn);
    }
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('cierra con la ✕ y con Escape', async () => {
    const onClose = vi.fn();
    const { unmount } = render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();

    const onClose2 = vi.fn();
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={onClose2} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose2).toHaveBeenCalledTimes(1);
  });

  it('"Copiar para Claude" lleva el title del live y copia la incidencia con su contexto', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<IncidenciaDetailDialog incidencia={sinTriaje} onClose={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Copiar para Claude' });
    expect(btn).toHaveAttribute(
      'title',
      'Copia la incidencia con su contexto y las instrucciones, lista para pegar en Claude'
    );
    await userEvent.click(btn);
    expect(writeText).toHaveBeenCalledTimes(1);
    const copiado = writeText.mock.calls[0][0] as string;
    expect(copiado).toContain(sinTriaje.texto);
    expect(copiado).toContain('"ruta": "/"');
  });

  it('la captura adjunta solo se renderiza si hay URL (los seeds no la traen)', () => {
    render(<IncidenciaDetailDialog incidencia={conTodo} onClose={() => {}} />);
    expect(screen.queryByAltText('Captura')).toBeNull();

    render(
      <IncidenciaDetailDialog
        incidencia={{ ...conTodo, attachmentUrl: 'https://example.test/captura.jpg' }}
        onClose={() => {}}
      />
    );
    expect(screen.getAllByAltText('Captura')[0]).toHaveClass('w-full', 'rounded-lg', 'border', 'border-slate-200');
  });
});
