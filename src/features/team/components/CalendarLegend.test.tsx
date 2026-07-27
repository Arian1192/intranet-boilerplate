import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarLegend } from './CalendarLegend';

describe('CalendarLegend', () => {
  it('renders checkbox and 5 legend dots', () => {
    render(<CalendarLegend approvedOnly={false} onApprovedOnly={() => {}} />);
    expect(screen.getByLabelText('Solo aprobadas')).toBeInTheDocument();
    expect(screen.getByText('Vacaciones')).toBeInTheDocument();
    expect(screen.getByText('Teletrabajo')).toBeInTheDocument();
    expect(screen.getByText('Baja')).toBeInTheDocument();
    expect(screen.getByText('Ausencia')).toBeInTheDocument();
    expect(screen.getByText('Festivo / finde')).toBeInTheDocument();
  });

  it('calls onApprovedOnly on change', async () => {
    const onChange = vi.fn();
    render(<CalendarLegend approvedOnly={false} onApprovedOnly={onChange} />);
    await userEvent.click(screen.getByLabelText('Solo aprobadas'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
