import type { Magazine } from './types';

export const MIXMAG: Magazine = {
  id: 'mixmag',
  name: 'Mixmag',
  spaceName: 'Mixmag Spain',
  region: 'España',
  hasMagazine: true,
  accent: '#E11D48',
  basePath: '/mixmag',
  resumen: { llevasTu: 0, atrasados: 0, pendientes: 0, enCurso: 4, revistaAbierta: 'Patrick Topping (Agosto 2026)' },
  editions: [
    { id: 'mix-29', number: 29, title: 'Patrick Topping', monthLabel: 'Agosto 2026', status: 'En preparación', readyCount: 0, totalCount: 1, percent: 0 },
  ],
};

export const TAGMAG: Magazine = {
  id: 'tagmag',
  name: 'TAGMAG',
  spaceName: 'TAGMAG',
  region: 'España',
  hasMagazine: true,
  accent: '#0EA5E9',
  basePath: '/tagmag',
  resumen: { llevasTu: 0, atrasados: 0, pendientes: 0, enCurso: 0, revistaAbierta: undefined },
  editions: [],
};
