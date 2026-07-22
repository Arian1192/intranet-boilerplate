import type { Person } from './types';

const deterministicColor = (name: string): string => {
  const palette = [
    '#22C55E', '#3B82F6', '#8B5CF6', '#F97316', '#EF4444',
    '#0F172A', '#EC4899', '#14B8A6', '#F59E0B', '#6366F1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const rawPeople: Omit<Person, 'avatarColor'>[] = [
  { id: 'alba-gelabert', name: 'Alba Gelabert', positions: ['Account Manager'], primaryPosition: 'Account Manager', department: 'Marketing', email: 'alba@blackmoose.es' },
  { id: 'alberto-egea', name: 'Alberto Egea', positions: ['Ads Specialist'], primaryPosition: 'Ads Specialist', department: 'Paid Ads' },
  { id: 'aldo-messina', name: 'Aldo Messina', positions: ['Booker'], primaryPosition: 'Booker', department: 'Booking', email: 'aldo@conceptoneagency.com' },
  { id: 'alejandro-gonzalez', name: 'Alejandro Gonzalez', positions: ['Logística', 'Booker'], primaryPosition: 'Logística', department: 'Logística', email: 'alex@blackmoose.es', phone: '664604640' },
  { id: 'borja-comino', name: 'Borja Comino', positions: ['Comercial', 'Redacción'], primaryPosition: 'Comercial', department: 'Comercial' },
  { id: 'carlos-pego', name: 'Carlos Pego Muñoz', positions: [], email: 'carlos@blackmoose.es', phone: '648815985', photoUrl: '/avatars/carlos-pego.jpg' },
  { id: 'carlos-ramudo', name: 'Carlos Ramudo Valencia', positions: [], department: 'Comercial', email: 'c.ramudo@blackmoose.es' },
  { id: 'federico-cortina', name: 'Federico Cortina', positions: ['Dirección', 'Redacción'], primaryPosition: 'Dirección', department: 'Redacción' },
  { id: 'fran-hinojosa', name: 'Fran Hinojosa Veredas', positions: [], email: 'fran@blackmoose.es' },
  { id: 'ines-batlle', name: 'Inés Batlle', positions: ['Comunicación', 'PR'], primaryPosition: 'Comunicación', department: 'Comunicación & PR', managerId: 'lucia-gomez' },
  { id: 'israel-gras', name: 'Israel B Gras Cuenca', positions: [], email: 'israel@blackmoose.es', phone: '606263540' },
  { id: 'jack-howell', name: 'Jack Howell', positions: [], email: 'jack@blackmoose.es', photoUrl: '/avatars/jack-howell.jpg' },
  { id: 'jassi-gonzalez', name: 'Jassi Gonzalez Montes', positions: [], email: 'jassi@blackmoose.es' },
  { id: 'joe-coe', name: 'Joe Coe', positions: ['Advancing'], primaryPosition: 'Advancing', department: 'Advancing', email: 'joe@blackmoose.es', phone: '620719682' },
  { id: 'juan-molina', name: 'Juan Manuel Molina', positions: ['Redacción'], primaryPosition: 'Redacción', department: 'Redacción' },
  { id: 'lucia-gomez', name: 'Lucía Gómez Garcia', positions: ['Account Manager'], primaryPosition: 'Account Manager', department: 'Comunicación & PR' },
  { id: 'maria-fernanda', name: 'Maria Fernanda Rodriguez', positions: ['Diseño'], primaryPosition: 'Diseño', department: 'Diseño' },
  { id: 'marian-aristimuno', name: 'Marian Aristimuno', positions: ['Redacción'], primaryPosition: 'Redacción', department: 'Redacción' },
  { id: 'oscar-buch', name: 'Oscar Buch', positions: ['Booker', 'Logística'], primaryPosition: 'Booker', department: 'Booking', email: 'oscar@conceptoneagency.com' },
  { id: 'pablo-carrera', name: 'Pablo Carrera', positions: ['Social Media Manager'], primaryPosition: 'Social Media Manager', department: 'Marketing', managerId: 'alba-gelabert' },
  { id: 'patricia-pareja', name: 'Patricia Pareja Casalí', positions: ['Project Manager'], primaryPosition: 'Project Manager', department: 'Management', email: 'patricia@blackmoose.es' },
  { id: 'sadkiel', name: 'Sadkiel', positions: ['Project Manager'], primaryPosition: 'Project Manager', department: 'Management', email: 'sadkiel@blackmoose.es' },
  { id: 'tony-carrerira', name: 'Tony Carrerira', positions: [], email: 'tony@blackmoose.es' },
  { id: 'usuario-test', name: 'Usuario Test', positions: [], email: 'cpegomunoz@gmail.com' },
  { id: 'victor-moreno', name: 'Victor Moreno', positions: ['Video Editor'], primaryPosition: 'Video Editor', department: 'Vídeo' },
  { id: 'yenifer-bernardo', name: 'Yenifer Bernardo', positions: ['Booker'], primaryPosition: 'Booker', department: 'Booking', email: 'yenifer@conceptoneagency.com' },
];

export const people: Person[] = rawPeople
  .map((p) => ({ ...p, avatarColor: deterministicColor(p.name) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const allPeople = (): Person[] => people;

export const searchPeople = (list: Person[], query: string, department?: string): Person[] => {
  const q = query.trim().toLowerCase();
  return list.filter((p) => {
    const matchesQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      (p.primaryPosition && p.primaryPosition.toLowerCase().includes(q)) ||
      p.positions.some((pos) => pos.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q));
    const matchesDepartment = !department || department === 'todos' || p.department === department;
    return matchesQuery && matchesDepartment;
  });
};

export const departmentsList = (): string[] =>
  [...new Set(people.map((p) => p.department).filter(Boolean))].sort((a, b) => a!.localeCompare(b!));

export const directReports = (personId: string): Person[] =>
  people.filter((p) => p.managerId === personId);

export const orgRoots = (): Person[] => people.filter((p) => !p.managerId);

export const personLabel = (person: Person): string => {
  const position = person.primaryPosition || person.positions[0];
  if (!position && !person.department) return '—';
  if (!person.department) return position || '—';
  return position ? `${position} · ${person.department}` : person.department;
};
