import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MisCreatividadesTab } from './MisCreatividadesTab';

describe('MisCreatividadesTab', () => {
  it('calca la cabecera y el estado vacío del live', () => {
    render(<MisCreatividadesTab />);
    expect(
      screen.getByText(
        'Tus creatividades por fecha de entrega. El color marca lo cerca que está el deadline.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('No tienes creatividades asignadas ahora mismo.')).toBeInTheDocument();
  });
});
