import { test, expect } from 'vitest';
import { accounts, campaigns, pieces, events, publications, analytics } from './seed';

test('seed matches reference counts', () => {
  expect(accounts).toHaveLength(1);
  expect(campaigns).toHaveLength(1);
  expect(pieces).toHaveLength(3);
  expect(events).toHaveLength(4);
  expect(publications).toHaveLength(1);
  expect(pieces.filter((p) => p.status === 'briefing')).toHaveLength(1);
  expect(analytics.mrr).toBe(800);
});

test('Set Times publication carries kanban/approval fields', () => {
  const pub = publications[0];
  expect(pub.time).toBe('12:00');
  expect(pub.textApproval).toBe('Aprobado');
  expect(pub.imageApproval).toBe('Pendiente');
  expect(pub.kanbanColumn).toBe('falta-arte');
});
