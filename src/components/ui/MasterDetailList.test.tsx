import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MasterDetailList } from './MasterDetailList';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'Cliente A' },
  { id: '2', name: 'Cliente B' },
];

describe('MasterDetailList', () => {
  it('shows the empty state until an item is selected, then renders its detail', () => {
    render(
      <MasterDetailList
        items={items}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );

    expect(screen.getByText('Selecciona un elemento o crea uno nuevo.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cliente A'));
    expect(screen.getByText('Detalle de Cliente A')).toBeInTheDocument();
    expect(screen.queryByText('Selecciona un elemento o crea uno nuevo.')).not.toBeInTheDocument();
  });

  it('supports controlled selection, listTop content and a detail override', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <MasterDetailList
        items={items}
        selectedId="2"
        onSelect={onSelect}
        listTop={<button type="button">+ Nueva cuenta</button>}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );

    expect(screen.getByText('+ Nueva cuenta')).toBeInTheDocument();
    expect(screen.getByText('Detalle de Cliente B')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cliente A'));
    expect(onSelect).toHaveBeenCalledWith('1');

    rerender(
      <MasterDetailList
        items={items}
        selectedId={null}
        onSelect={onSelect}
        detailOverride={<p>Formulario de alta</p>}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );
    expect(screen.getByText('Formulario de alta')).toBeInTheDocument();
  });

  it('keeps internal selection working when onSelect is passed without selectedId', () => {
    const onSelect = vi.fn();
    render(
      <MasterDetailList
        items={items}
        onSelect={onSelect}
        renderRow={(item) => <span>{item.name}</span>}
        renderDetail={(item) => <p>Detalle de {item.name}</p>}
      />
    );

    fireEvent.click(screen.getByText('Cliente A'));
    expect(onSelect).toHaveBeenCalledWith('1');
    expect(screen.getByText('Detalle de Cliente A')).toBeInTheDocument();
  });
});
