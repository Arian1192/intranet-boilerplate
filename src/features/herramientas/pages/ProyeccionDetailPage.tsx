import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { UnderlineTabs } from '@/components/ui';
import { useProyecciones } from '../data/proyecciones-context';
import { ProyeccionToolbar } from '../components/ProyeccionToolbar';
import { ProyeccionEstadoCard } from '../components/ProyeccionEstadoCard';
import { ComentariosPanel } from '../components/ComentariosPanel';
import { InfoComoSeCalcula } from '../components/InfoComoSeCalcula';
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
  const [comentariosAbierto, setComentariosAbierto] = useState(false);
  const [infoAbierta, setInfoAbierta] = useState(false);

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
      <ProyeccionToolbar
        proyeccion={proyeccion}
        isDirty={isDirty}
        comentariosAbierto={comentariosAbierto}
        infoAbierta={infoAbierta}
        onGuardar={() => setIsDirty(false)}
        onToggleComentarios={() => setComentariosAbierto((o) => !o)}
        onToggleInfo={() => setInfoAbierta((o) => !o)}
      />
      {comentariosAbierto && (
        <ComentariosPanel
          comentarios={proyeccion.comentarios}
          onEnviar={(texto) =>
            handleUpdate({
              comentarios: [
                ...proyeccion.comentarios,
                { id: crypto.randomUUID(), autor: 'Tú', texto, fecha: new Date().toISOString() },
              ],
            })
          }
        />
      )}
      <ProyeccionEstadoCard proyeccion={proyeccion} onUpdate={handleUpdate} />
      <UnderlineTabs options={TAB_OPTIONS} value={tab} onChange={setTab} />
      {infoAbierta && <InfoComoSeCalcula onClose={() => setInfoAbierta(false)} />}
      {tab === 'acuerdo' && <AcuerdoTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
      {tab === 'prevision' && <PrevisionTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
      {tab === 'real' && <RealTab proyeccion={proyeccion} onUpdate={handleUpdate} />}
    </div>
  );
}
