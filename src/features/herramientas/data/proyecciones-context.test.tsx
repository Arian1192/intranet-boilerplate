import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProyeccionesProvider, useProyecciones } from './proyecciones-context';

function TestConsumer() {
  const { proyecciones, crear, duplicar, borrar, actualizar } = useProyecciones();
  return (
    <div>
      <p data-testid="count">{proyecciones.length}</p>
      <ul>
        {proyecciones.map((p) => (
          <li key={p.id}>{p.nombre} — {p.estado}</li>
        ))}
      </ul>
      <button onClick={() => crear()}>crear</button>
      <button onClick={() => duplicar(proyecciones[0].id)}>duplicar</button>
      <button onClick={() => borrar(proyecciones[0].id)}>borrar</button>
      <button onClick={() => actualizar(proyecciones[0].id, { estado: 'rechazada' })}>actualizar</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <ProyeccionesProvider>
      <TestConsumer />
    </ProyeccionesProvider>
  );
}

describe('ProyeccionesProvider / useProyecciones', () => {
  it('arranca con la semilla (1 proyección)', () => {
    renderConsumer();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('crear() añade una proyección nueva', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('crear'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('duplicar() añade una copia', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('duplicar'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByText(/PQ @ SLS Barcelona \(copia\)/)).toBeInTheDocument();
  });

  it('borrar() quita la proyección', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('borrar'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('actualizar() cambia un campo', async () => {
    renderConsumer();
    await userEvent.click(screen.getByText('actualizar'));
    expect(screen.getByText(/PQ @ SLS Barcelona — rechazada/)).toBeInTheDocument();
  });
});
