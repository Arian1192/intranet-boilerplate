import { describe, it, expect } from 'vitest';
import { allPeople, searchPeople, departmentsList, directReports, orgRoots, personLabel } from './people';

describe('people data', () => {
  it('has 26 people in alphabetical order', () => {
    const people = allPeople();
    expect(people).toHaveLength(26);
    const names = people.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('Alba Gelabert has the expected fields', () => {
    const alba = allPeople().find((p) => p.name === 'Alba Gelabert')!;
    expect(alba.positions).toEqual(['Account Manager']);
    expect(alba.primaryPosition).toBe('Account Manager');
    expect(alba.department).toBe('Marketing');
    expect(alba.email).toBe('alba@blackmoose.es');
    expect(alba.managerId).toBeUndefined();
    expect(alba.avatarColor).toMatch(/^#/);
  });

  it('has exactly two manager relationships', () => {
    const people = allPeople();
    const withManager = people.filter((p) => p.managerId);
    expect(withManager).toHaveLength(2);
    expect(withManager.map((p) => p.name)).toEqual(expect.arrayContaining(['Pablo Carrera', 'Inés Batlle']));
  });

  it('directReports and orgRoots match hierarchy', () => {
    const alba = allPeople().find((p) => p.name === 'Alba Gelabert')!;
    const pablo = allPeople().find((p) => p.name === 'Pablo Carrera')!;
    const lucia = allPeople().find((p) => p.name === 'Lucía Gómez Garcia')!;
    const ines = allPeople().find((p) => p.name === 'Inés Batlle')!;

    expect(directReports(alba.id)).toEqual([pablo]);
    expect(directReports(lucia.id)).toEqual([ines]);
    expect(orgRoots()).toContain(alba);
    expect(orgRoots()).toContain(lucia);
    expect(orgRoots()).not.toContain(pablo);
    expect(orgRoots()).not.toContain(ines);
  });

  it('searchPeople filters by name, position and email', () => {
    const people = allPeople();
    expect(searchPeople(people, 'alba')).toHaveLength(1);
    expect(searchPeople(people, 'Booker')).toHaveLength(searchPeople(people, 'Booker').length);
    expect(searchPeople(people, 'alba@blackmoose.es')).toHaveLength(1);
    expect(searchPeople(people, 'zzz')).toHaveLength(0);
  });

  it('departmentsList returns unique sorted departments', () => {
    const deps = departmentsList();
    expect(deps).toEqual([...new Set(deps)].sort((a, b) => a.localeCompare(b)));
    expect(deps).toContain('Marketing');
  });

  it('personLabel builds puesto · departamento', () => {
    const alba = allPeople().find((p) => p.name === 'Alba Gelabert')!;
    expect(personLabel(alba)).toBe('Account Manager · Marketing');
    const carlos = allPeople().find((p) => p.name === 'Carlos Pego Muñoz')!;
    expect(personLabel(carlos)).toBe('—');
  });
});
