import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository', () => {
  it('returns a dashboard with modules and events', async () => {
    const repo = new MockRepository();
    const dashboard = await repo.getDashboard();
    expect(dashboard.modules.length).toBeGreaterThan(0);
    expect(dashboard.upcomingEvents.length).toBeGreaterThan(0);
  });

  it('returns a user session on login', async () => {
    const repo = new MockRepository();
    const session = await repo.login('test@example.com', 'password');
    expect(session.user.email).toBe('test@example.com');
    expect(session.accessToken).toBeDefined();
  });

  it('includes content on news items for the expandable card', async () => {
    const repo = new MockRepository();
    const dashboard = await repo.getDashboard();
    expect(dashboard.news.length).toBeGreaterThan(0);
    expect(dashboard.news.every((n) => typeof n.content === 'string' && n.content.length > 0)).toBe(true);
  });

  it('getDashboard devuelve los 12 módulos, festivo y sin recordatorios', async () => {
    const repo = new MockRepository();
    const d = await repo.getDashboard();
    expect(d.modules).toHaveLength(12);
    expect(d.festivoNotice).toMatch(/festivo/i);
    expect(d.weather).toContain('Barcelona');
    expect(d.reminders).toEqual([]);
  });
});
