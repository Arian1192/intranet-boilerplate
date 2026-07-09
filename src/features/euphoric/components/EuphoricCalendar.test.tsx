import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { EuphoricCalendar } from './EuphoricCalendar';

describe('EuphoricCalendar', () => {
  it('renders the month label, uppercase weekday header, bare-arrow nav, and the today marker on day 9', () => {
    render(
      <MemoryRouter>
        <EuphoricCalendar year={2026} month={6} monthLabel="Julio 2026" today={{ year: 2026, month: 6, day: 9 }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.getByText('Lun')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: 'Mes anterior' });
    const nextButton = screen.getByRole('button', { name: 'Mes siguiente' });
    expect(prevButton).toHaveTextContent('←');
    expect(prevButton).not.toHaveTextContent('Anterior');
    expect(nextButton).toHaveTextContent('→');
    expect(nextButton).not.toHaveTextContent('Siguiente');

    const todayNumber = screen.getByText('9');
    expect(todayNumber).toHaveClass('rounded-full', 'bg-brand-600', 'text-white');
  });

  it('places content returned by renderDay on the matching day cell only', () => {
    render(
      <MemoryRouter>
        <EuphoricCalendar
          year={2026}
          month={6}
          monthLabel="Julio 2026"
          renderDay={(isoDate) => (isoDate === '2026-07-10' ? <div>Set Times</div> : null)}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Set Times')).toBeInTheDocument();
  });

  it('invokes onPrevMonth / onNextMonth when the arrows are clicked', async () => {
    const onPrevMonth = vi.fn();
    const onNextMonth = vi.fn();
    render(
      <MemoryRouter>
        <EuphoricCalendar
          year={2026}
          month={6}
          monthLabel="Julio 2026"
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
      </MemoryRouter>
    );

    screen.getByRole('button', { name: 'Mes anterior' }).click();
    screen.getByRole('button', { name: 'Mes siguiente' }).click();

    expect(onPrevMonth).toHaveBeenCalledTimes(1);
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });
});
