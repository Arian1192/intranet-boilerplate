import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { MasterDetailList } from '@/components/ui';
import { Button } from '@/components/ui';
import { FichasFilterPanel } from '../components/FichasFilterPanel';
import { FichaListRow } from '../components/FichaListRow';
import { FichaDetailPanel } from '../components/FichaDetailPanel';
import { CostDashboard } from '../components/CostDashboard';
import { allPeople } from '../data/people';
import { fichas, filterFichas, fichaFor } from '../data/fichas';
import type { CompanyId } from '../data/types';

export function FichasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companyId, setCompanyId] = useState<CompanyId | 'todas'>('todas');
  const [type, setType] = useState<'contratado' | 'freelance' | 'todos'>('todos');

  const people = useMemo(() => allPeople(), []);
  const filtered = useMemo(() => filterFichas(fichas, { companyId, type }), [companyId, type]);
  const selectedId = searchParams.get('p') ?? undefined;

  const handleSelect = (id: string) => {
    setSearchParams({ p: id });
  };

  const selectedPerson = selectedId ? people.find((p) => p.id === selectedId) : undefined;
  const selectedFicha = selectedId ? fichaFor(selectedId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Fichas del equipo</h1>
          <p className="text-slate-500">
            Información sensible: datos personales, condiciones económicas, vacaciones y horas. El resto del equipo solo ve el directorio.
          </p>
        </div>
        <Button type="button" variant="secondary">
          ⬇ Exportar a Excel
        </Button>
      </div>
      <MasterDetailList
        items={filtered}
        selectedId={selectedId}
        onSelect={handleSelect}
        listTop={
          <FichasFilterPanel
            companyId={companyId}
            onCompany={setCompanyId}
            type={type}
            onType={setType}
          />
        }
        renderRow={(ficha) => {
          const person = people.find((p) => p.id === ficha.personId)!;
          return <FichaListRow person={person} ficha={ficha} />;
        }}
        renderDetail={(ficha) => {
          const person = people.find((p) => p.id === ficha.personId)!;
          return <FichaDetailPanel person={person} ficha={ficha} />;
        }}
        detailOverride={
          selectedPerson && selectedFicha ? (
            <FichaDetailPanel person={selectedPerson} ficha={selectedFicha} />
          ) : undefined
        }
      />
      <CostDashboard />
    </div>
  );
}
