import { test, expect } from 'vitest';
import { accounts, campaigns, pieces, events, publications, analytics } from './seed';

test('seed matches reference counts', () => {
  expect(accounts).toHaveLength(3);
  expect(campaigns).toHaveLength(1);
  expect(pieces).toHaveLength(10);
  expect(events).toHaveLength(9);
  expect(publications).toHaveLength(9);
  expect(analytics.mrr).toBe(2800);
});

test('las creatividades espejan el reparto por estado del tablero del live', () => {
  const byStatus = (status: string) => pieces.filter((p) => p.status === status).length;
  expect(byStatus('briefing')).toBe(5);
  expect(byStatus('en-produccion')).toBe(1);
  expect(byStatus('revision')).toBe(0);
  expect(byStatus('cambios')).toBe(1);
  expect(byStatus('aprobado')).toBe(3);
});

test('las publicaciones espejan el kanban del live', () => {
  const byColumn = (column: string) => publications.filter((p) => p.kanbanColumn === column).length;
  expect(byColumn('falta-copy')).toBe(6);
  expect(byColumn('falta-arte')).toBe(1);
  expect(byColumn('falta-aprobacion')).toBe(1);
  expect(byColumn('listo')).toBe(0);
  expect(byColumn('programado')).toBe(0);
  expect(byColumn('publicado')).toBe(1);
});

test('los eventos espejan tipo y sede del live', () => {
  expect(events.filter((e) => e.kind === 'produccion').map((e) => e.name)).toEqual([
    'Mixmag Intimate Sessions: BLOND:ISH',
    'Please Quiet x SIGHT',
  ]);
  expect(events.find((e) => e.name === 'Mixmag Intimate Sessions: BLOND:ISH')?.city).toBe('Ibiza');
  expect(events.filter((e) => e.city === 'Barcelona')).toHaveLength(7);
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
  const pub = publications.find((publication) => publication.id === 'pub-settimes');
  expect(pub?.time).toBe('12:00');
  expect(pub?.textApproval).toBe('Aprobado');
  expect(pub?.imageApproval).toBe('Pendiente');
  expect(pub?.kanbanColumn).toBe('falta-copy');
});
