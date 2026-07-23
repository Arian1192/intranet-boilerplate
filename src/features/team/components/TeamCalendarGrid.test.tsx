import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamCalendarGrid } from './TeamCalendarGrid';
import { allPeople } from '../data/people';
import { absencesForMonth } from '../data/absences';

describe('TeamCalendarGrid', () => {
  const people = allPeople();
  const absences = absencesForMonth(2026, 7);

  it('renders header with 31 days and Días column', () => {
    render(<TeamCalendarGrid year={2026} month={7} people={people} absences={absences} approvedOnly={false} />);
    expect(screen.getByText('Persona')).toBeInTheDocument();
    expect(screen.getByText('Días')).toBeInTheDocument();
    const header = screen.getByText('Persona').closest('tr')!;
    for (let day = 1; day <= 31; day += 1) {
      expect(header).toHaveTextContent(day.toString());
    }
  });

  it('shows 5 days for Alejandro Gonzalez', () => {
    render(<TeamCalendarGrid year={2026} month={7} people={people} absences={absences} approvedOnly={false} />);
    const row = screen.getByText('Alejandro Gonzalez').closest('tr')!;
    expect(row).toHaveTextContent('5');
  });

  it('shows — for people without absences', () => {
    render(<TeamCalendarGrid year={2026} month={7} people={people} absences={absences} approvedOnly={false} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(20);
  });
});
