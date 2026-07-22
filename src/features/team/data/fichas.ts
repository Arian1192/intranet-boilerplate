import type { Company, CompanyId, Ficha } from './types';
import { people } from './people';

export const companies: Company[] = [
  { id: 'conceptone', name: 'ConceptOne', colorHex: '#8B5CF6', monthlyCost: 11460.00 },
  { id: 'euphoric', name: 'Euphoric Media', colorHex: '#F97316', monthlyCost: 8937.68 },
  { id: 'mixmag', name: 'Mixmag Spain', colorHex: '#EF4444', monthlyCost: 6750.00 },
  { id: 'etra', name: 'Etra Agency', colorHex: '#3B82F6', monthlyCost: 4894.39 },
  { id: 'tagmag', name: 'TAGMAG', colorHex: '#22C55E', monthlyCost: 2480.00 },
  { id: 'cruda', name: 'CRUDA', colorHex: '#0F172A', monthlyCost: 0.00 },
];

const fichaById = (personId: string, overrides: Partial<Ficha> = {}): Ficha => ({
  id: `ficha-${personId}`,
  personId,
  companyIds: [],
  employmentType: 'freelance',
  hasAccount: false,
  active: false,
  ...overrides,
});

export const fichas: Ficha[] = people.map((p) => {
  const costMap: Record<string, number | undefined> = {
    'alberto-egea': 4000.00,
    'lucia-gomez': 3068.33,
    'maria-fernanda': 2420.00,
    'borja-comino': 2400.00,
    'pablo-carrera': 2007.68,
    'alba-gelabert': 2000.00,
    sadkiel: 2000.00,
    'federico-cortina': 1900.00,
    'ines-batlle': 1826.06,
    'victor-moreno': 1700.00,
    'aldo-messina': 1500.00,
    'joe-coe': 1500.00,
    'marian-aristimuno': 1500.00,
    'patricia-pareja': 1500.00,
    'yenifer-bernardo': 1500.00,
    'alejandro-gonzalez': 1200.00,
    'oscar-buch': 1200.00,
    'juan-molina': 800.00,
    'carlos-ramudo': 500.00,
  };
  const contratados = ['ines-batlle', 'lucia-gomez', 'pablo-carrera', 'usuario-test'];
  return fichaById(p.id, {
    companyIds: [],
    employmentType: contratados.includes(p.id) ? 'contratado' : 'freelance',
    monthlyCost: costMap[p.id],
    hasAccount: p.id === 'alba-gelabert',
    active: p.id === 'alba-gelabert',
    birthDate: p.id === 'alba-gelabert' ? '1997-07-09' : undefined,
    vacationDaysPerYear: p.id === 'alba-gelabert' ? 22 : undefined,
  });
});

export const fichaFor = (personId: string): Ficha | undefined =>
  fichas.find((f) => f.personId === personId);

export const filterFichas = (
  list: Ficha[],
  f: { companyId?: CompanyId | 'todas'; type?: Ficha['employmentType'] | 'todos' }
): Ficha[] =>
  list.filter((item) => {
    const matchesCompany =
      !f.companyId || f.companyId === 'todas' || item.companyIds.includes(f.companyId);
    const matchesType = !f.type || f.type === 'todos' || item.employmentType === f.type;
    return matchesCompany && matchesType;
  });

export const totalMonthlyCost = (): number =>
  companies.reduce((sum, c) => sum + c.monthlyCost, 0);

export const costRankingByPerson = (): { person: typeof people[number]; ficha: Ficha }[] => {
  const withCost = fichas
    .filter((f) => f.monthlyCost !== undefined)
    .map((f) => ({ person: people.find((p) => p.id === f.personId)!, ficha: f }));
  return withCost.sort((a, b) => b.ficha.monthlyCost! - a.ficha.monthlyCost!);
};
