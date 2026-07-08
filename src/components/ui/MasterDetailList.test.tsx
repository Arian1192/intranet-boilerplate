import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MasterDetailList } from './MasterDetailList';

interface Item {
  id: string;
  name: string;
}

describe('MasterDetailList', () => {
  it('shows the empty state until an item is selected, then renders its detail', () => {
    const items: Item[] = [
      { id: '1', name: 'Cliente A' },
      { id: '2', name: 'Cliente B' },
    ];

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
});
