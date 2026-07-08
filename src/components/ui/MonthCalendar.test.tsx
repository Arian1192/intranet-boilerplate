import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MonthCalendar } from './MonthCalendar';

describe('MonthCalendar', () => {
  it('renders the month label, weekday header, and an event chip on its day', () => {
    const onNextMonth = vi.fn();
    render(
      <MonthCalendar
        year={2026}
        month={6}
        monthLabel="Julio de 2026"
        events={[{ id: 'e1', isoDate: '2026-07-15', label: 'Evento Primavera', toneClassName: 'bg-blue-100 text-blue-700' }]}
        onPrevMonth={() => {}}
        onNextMonth={onNextMonth}
      />
    );

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
    expect(screen.getByText('Lun')).toBeInTheDocument();
    expect(screen.getByText('Evento Primavera')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Siguiente →'));
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });
});
