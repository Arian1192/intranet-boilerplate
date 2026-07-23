import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentosTipografiaPage } from './DocumentosTipografiaPage';

describe('DocumentosTipografiaPage', () => {
  it('título y los 7 sliders con su label', () => {
    render(<DocumentosTipografiaPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Documentos · tipografía' })).toBeInTheDocument();
    [
      'Tamaño del texto', 'Interlineado', 'Aire entre párrafos',
      'Título 1', 'Título 2', 'Título 3', 'Interlineado de los títulos',
    ].forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());
  });

  it('el panel "Así se verá" refleja el tamaño de texto en vivo', () => {
    render(<DocumentosTipografiaPage />);
    const h1 = screen.getByText('Rider de Charlotte de Witte');
    expect(h1).toHaveStyle({ fontSize: `${16 * 1.9}px` });

    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '20' } });
    expect(screen.getByText('Rider de Charlotte de Witte')).toHaveStyle({ fontSize: `${20 * 1.9}px` });
  });

  it('"Volver a los valores de fábrica" resetea tras un cambio', async () => {
    render(<DocumentosTipografiaPage />);
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '22' } });
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Volver a los valores de fábrica' }));
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });
});
