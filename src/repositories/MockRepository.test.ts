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
});
