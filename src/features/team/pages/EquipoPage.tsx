import { useMemo, useState } from 'react';
import { SegmentedControl } from '@/components/ui';
import { PersonCard } from '../components/PersonCard';
import { DirectorioToolbar } from '../components/DirectorioToolbar';
import { allPeople, searchPeople, departmentsList } from '../data/people';

export function EquipoPage() {
  const [view, setView] = useState<'directorio' | 'organigrama'>('directorio');
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');

  const people = useMemo(() => allPeople(), []);
  const departments = useMemo(() => departmentsList(), []);
  const filtered = useMemo(
    () => searchPeople(people, query, department),
    [people, query, department]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Equipo</h1>
        <p className="text-slate-500">Quién es quién, cómo contactarle y de quién depende.</p>
      </div>
      <SegmentedControl
        tone="dark"
        options={[
          { label: 'Directorio', value: 'directorio' },
          { label: 'Organigrama', value: 'organigrama' },
        ]}
        value={view}
        onChange={(v) => setView(v)}
      />
      {view === 'directorio' && (
        <div className="space-y-4">
          <DirectorioToolbar
            query={query}
            onQuery={setQuery}
            departments={departments}
            department={department}
            onDepartment={setDepartment}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      )}
      {view === 'organigrama' && <div data-testid="organigrama">Organigrama</div>}
    </div>
  );
}
