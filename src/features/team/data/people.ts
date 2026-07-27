import type { Person } from './types';

// Colores sembrados a partir de las capturas del live (live-team-equipo.png / live-team-calendario.png).
// Las personas con photoUrl usan foto real en el live; el color actúa como fallback.
const rawPeople: Person[] = [
  { id: 'alba-gelabert', name: 'Alba Gelabert', positions: ['Account Manager'], primaryPosition: 'Account Manager', department: 'Marketing', email: 'alba@blackmoose.es', avatarColor: '#16a34a' },
  { id: 'alberto-egea', name: 'Alberto Egea', positions: ['Ads Specialist'], primaryPosition: 'Ads Specialist', department: 'Paid Ads', avatarColor: '#059669' },
  { id: 'aldo-messina', name: 'Aldo Messina', positions: ['Booker'], primaryPosition: 'Booker', department: 'Booking', email: 'aldo@conceptoneagency.com', avatarColor: '#44444C' },
  { id: 'alejandro-gonzalez', name: 'Alejandro Gonzalez', positions: ['Logística', 'Booker'], primaryPosition: 'Logística', department: 'Logística', email: 'alex@blackmoose.es', phone: '664604640', avatarColor: '#4f46e5' },
  { id: 'borja-comino', name: 'Borja Comino', positions: ['Comercial', 'Redacción'], primaryPosition: 'Comercial', department: 'Comercial', avatarColor: '#0891b2' },
  { id: 'carlos-pego', name: 'Carlos Pego Muñoz', positions: [], email: 'carlos@blackmoose.es', phone: '648815985', photoUrl: '/avatars/carlos-pego.jpg', avatarColor: '#c0957a' },
  { id: 'carlos-ramudo', name: 'Carlos Ramudo Valencia', positions: [], department: 'Comercial', email: 'c.ramudo@blackmoose.es', avatarColor: '#2563eb' },
  { id: 'federico-cortina', name: 'Federico Cortina', positions: ['Dirección', 'Redacción'], primaryPosition: 'Dirección', department: 'Redacción', avatarColor: '#2563eb' },
  { id: 'fran-hinojosa', name: 'Fran Hinojosa Veredas', positions: [], email: 'fran@blackmoose.es', avatarColor: '#ea580c' },
  { id: 'ines-batlle', name: 'Inés Batlle', positions: ['Comunicación', 'PR'], primaryPosition: 'Comunicación', department: 'Comunicación & PR', managerId: 'lucia-gomez', avatarColor: '#ca8a04' },
  { id: 'israel-gras', name: 'Israel B Gras Cuenca', positions: [], email: 'israel@blackmoose.es', phone: '606263540', avatarColor: '#44444C' },
  { id: 'jack-howell', name: 'Jack Howell', positions: [], email: 'jack@blackmoose.es', photoUrl: '/avatars/jack-howell.jpg', avatarColor: '#64748b' },
  { id: 'jassi-gonzalez', name: 'Jassi Gonzalez Montes', positions: [], email: 'jassi@blackmoose.es', avatarColor: '#44444C' },
  { id: 'joe-coe', name: 'Joe Coe', positions: ['Advancing'], primaryPosition: 'Advancing', department: 'Advancing', email: 'joe@blackmoose.es', phone: '620719682', avatarColor: '#2563eb' },
  { id: 'juan-molina', name: 'Juan Manuel Molina', positions: ['Redacción'], primaryPosition: 'Redacción', department: 'Redacción', avatarColor: '#ea580c' },
  { id: 'lucia-gomez', name: 'Lucía Gómez Garcia', positions: ['Account Manager'], primaryPosition: 'Account Manager', department: 'Comunicación & PR', avatarColor: '#0891b2' },
  { id: 'maria-fernanda', name: 'Maria Fernanda Rodriguez', positions: ['Diseño'], primaryPosition: 'Diseño', department: 'Diseño', avatarColor: '#4f46e5' },
  { id: 'marian-aristimuno', name: 'Marian Aristimuno', positions: ['Redacción'], primaryPosition: 'Redacción', department: 'Redacción', avatarColor: '#2563eb' },
  { id: 'oscar-buch', name: 'Oscar Buch', positions: ['Booker', 'Logística'], primaryPosition: 'Booker', department: 'Booking', email: 'oscar@conceptoneagency.com', avatarColor: '#db2777' },
  { id: 'pablo-carrera', name: 'Pablo Carrera', positions: ['Social Media Manager'], primaryPosition: 'Social Media Manager', department: 'Marketing', managerId: 'alba-gelabert', avatarColor: '#44444C' },
  { id: 'patricia-pareja', name: 'Patricia Pareja Casalí', positions: ['Project Manager'], primaryPosition: 'Project Manager', department: 'Management', email: 'patricia@blackmoose.es', avatarColor: '#2563eb' },
  { id: 'sadkiel', name: 'Sadkiel', positions: ['Project Manager'], primaryPosition: 'Project Manager', department: 'Management', email: 'sadkiel@blackmoose.es', avatarColor: '#059669' },
  { id: 'tony-carrerira', name: 'Tony Carrerira', positions: [], email: 'tony@blackmoose.es', avatarColor: '#dc2626' },
  { id: 'usuario-test', name: 'Usuario Test', positions: [], email: 'cpegomunoz@gmail.com', avatarColor: '#ea580c' },
  { id: 'victor-moreno', name: 'Victor Moreno', positions: ['Video Editor'], primaryPosition: 'Video Editor', department: 'Vídeo', avatarColor: '#16a34a' },
  { id: 'yenifer-bernardo', name: 'Yenifer Bernardo', positions: ['Booker'], primaryPosition: 'Booker', department: 'Booking', email: 'yenifer@conceptoneagency.com', avatarColor: '#2563eb' },
];

export const people: Person[] = rawPeople.sort((a, b) => a.name.localeCompare(b.name));

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
  [...new Set(people.map((p) => p.department).filter((d): d is string => Boolean(d)))].sort((a, b) => a.localeCompare(b));

export const directReports = (personId: string): Person[] =>
  people.filter((p) => p.managerId === personId);

export const orgRoots = (): Person[] => people.filter((p) => !p.managerId);

export const personLabel = (person: Person): string => {
  const position = person.primaryPosition || person.positions[0];
  if (!position && !person.department) return '—';
  if (!person.department) return position || '—';
  return position ? `${position} · ${person.department}` : person.department;
};
