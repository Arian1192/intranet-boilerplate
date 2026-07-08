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

  it('does not render events from a different month', () => {
    render(
      <MonthCalendar
        year={2026}
        month={6}
        monthLabel="Julio de 2026"
        events={[{ id: 'e1', isoDate: '2026-08-15', label: 'Evento Agosto', toneClassName: 'bg-blue-100 text-blue-700' }]}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
      />
    );

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
    expect(screen.queryByText('Evento Agosto')).not.toBeInTheDocument();
  });

  it('does not misclassify month-boundary events due to timezone parsing', () => {
    // Test that an event on August 1st (2026-08-01) is not rendered when viewing July.
    // This catches timezone bugs where UTC-parsing a date-only string then reading it
    // in local timezone can shift it to the previous day/month in negative UTC offsets.
    render(
      <MonthCalendar
        year={2026}
        month={6}
        monthLabel="Julio de 2026"
        events={[{ id: 'e1', isoDate: '2026-08-01', label: 'Evento 1 de Agosto', toneClassName: 'bg-green-100 text-green-700' }]}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
      />
    );

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
    expect(screen.queryByText('Evento 1 de Agosto')).not.toBeInTheDocument();
  });
});
