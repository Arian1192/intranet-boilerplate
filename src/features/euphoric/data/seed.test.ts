import { test, expect } from 'vitest';
import { accounts, campaigns, pieces, events, publications, analytics } from './seed';

test('seed matches reference counts', () => {
  expect(accounts).toHaveLength(3);
  expect(campaigns).toHaveLength(1);
  expect(pieces).toHaveLength(3);
  expect(events).toHaveLength(4);
  expect(publications).toHaveLength(2);
  expect(pieces.filter((p) => p.status === 'briefing')).toHaveLength(1);
  expect(analytics.mrr).toBe(800);
});

test('SIGHT espeja retainer, bases de datos y plantillas del live', () => {
  const sight = accounts.find((a) => a.name === 'SIGHT');
  expect(sight?.retainer).toBe(800);
  expect(sight?.services).toEqual(['Redes sociales', 'Paid media', 'Contenido']);
  expect(sight?.databases.map((d) => [d.name, d.cleanContacts, d.totalContacts])).toEqual([
    ['Fourvenues Tickets', 258, 408],
    ['fv', 84, 158],
  ]);
  expect(sight?.publicationTemplates.map((t) => [t.title, t.offsetDays])).toEqual([
    ['Set Times {evento}', -1],
    ['Salida {evento}', -30],
  ]);
  expect(sight?.creativeTemplates.map((t) => [t.name, t.deadlineOffsetDays])).toEqual([
    ['Flyer {evento}', -30],
    ['Set Times {evento}', -5],
  ]);
});

test('Opium Bcn y Mogli Marbella espejan sus retainers del live', () => {
  expect(accounts.find((a) => a.name === 'Opium Bcn')?.retainer).toBe(2000);
  expect(accounts.find((a) => a.name === 'Mogli Marbella')?.retainer).toBe(0);
});

test('el espejo del live tiene 2 cuentas activas de 3 y ninguna campaña en curso', () => {
  expect(accounts.filter((a) => a.status === 'Activa').map((a) => a.name)).toEqual(['Opium Bcn', 'SIGHT']);
  expect(accounts.find((a) => a.name === 'Mogli Marbella')?.status).toBe('Pausada');
  expect(campaigns.filter((c) => c.status === 'en-curso')).toHaveLength(0);
});

test('Set Times publication carries kanban/approval fields', () => {
  const pub = publications[0];
  expect(pub.time).toBe('12:00');
  expect(pub.textApproval).toBe('Aprobado');
  expect(pub.imageApproval).toBe('Pendiente');
  expect(pub.kanbanColumn).toBe('falta-arte');
});
