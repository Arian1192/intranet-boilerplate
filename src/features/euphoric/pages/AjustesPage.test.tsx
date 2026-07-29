import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { AjustesPage } from './AjustesPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <AjustesPage />
    </MemoryRouter>
  );
}

describe('Ajustes del espacio (calco del live 2026-07-29)', () => {
  test('cabecera del espacio', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Ajustes · Euphoric Media' })).toBeInTheDocument();
    expect(screen.getByText('Parámetros de funcionamiento del espacio de Euphoric.')).toBeInTheDocument();
  });

  test('umbrales de color del deadline con los valores del live', () => {
    renderPage();
    expect(screen.getByText('COLORES DEL DEADLINE DE LAS CREATIVIDADES')).toBeInTheDocument();
    expect(
      screen.getByText('Cada creatividad se pinta con un color según los días que faltan hasta su fecha límite:')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Amarillo cuando faltan (días) ≤')).toHaveValue(7);
    expect(screen.getByLabelText('Rojo cuando faltan (días) ≤')).toHaveValue(2);
    expect(
      screen.getByText('A partir de este umbral (o menos), la creatividad deja de estar en verde.')
    ).toBeInTheDocument();
  });

  test('coste interno por hora y guardado inerte', () => {
    renderPage();
    expect(screen.getByText('RENTABILIDAD')).toBeInTheDocument();
    expect(screen.getByLabelText('Coste interno por hora (€)')).toHaveValue(25);
    expect(screen.getByRole('button', { name: 'Guardar ajustes' })).toBeInTheDocument();
  });
});
