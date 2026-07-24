import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { UnderlineTabs } from '@/components/ui';
import { useProyecciones } from '../data/proyecciones-context';
import { ProyeccionHeader } from '../components/ProyeccionHeader';
import { AcuerdoTab } from '../components/AcuerdoTab';
import { PrevisionTab } from '../components/PrevisionTab';
import { RealTab } from '../components/RealTab';
import type { Proyeccion } from '../data/types';

type Tab = 'acuerdo' | 'prevision' | 'real';

const TAB_OPTIONS: { label: string; value: Tab }[] = [
  { label: 'Acuerdo', value: 'acuerdo' },
  { label: 'Previsión', value: 'prevision' },
  { label: 'Real', value: 'real' },
];

export function ProyeccionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { proyecciones, actualizar } = useProyecciones();
  const [tab, setTab] = useState<Tab>('acuerdo');
  const [isDirty, setIsDirty] = useState(false);

  const proyeccion = proyecciones.find((p) => p.id === id);

  if (!proyeccion) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-slate-500">Proyección no encontrada.</p>
        <Link to="/herramientas/proyecciones" className="text-brand-600 underline">Volver a la lista</Link>
      </div>
    );
  }

  const handleUpdate = (patch: Partial<Proyeccion>) => {
    actualizar(proyeccion.id, patch);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ProyeccionHeader proyeccion={proyeccion} isDirty={isDirty} onUpdate={handleUpdate} onGuardar={() => setIsDirty(false)} />
      <UnderlineTabs options={TAB_OPTIONS} value={tab} onChange={setTab} />
      {tab === 'acuerdo' && <AcuerdoTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
      {tab === 'prevision' && <PrevisionTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
      {tab === 'real' && <RealTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
    </div>
  );
}
