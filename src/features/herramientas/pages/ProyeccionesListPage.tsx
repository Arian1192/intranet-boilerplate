import { useNavigate } from 'react-router';
import { Button } from '@/components/ui';
import { useProyecciones } from '../data/proyecciones-context';
import { ProyeccionRow } from '../components/ProyeccionRow';

export function ProyeccionesListPage() {
  const navigate = useNavigate();
  const { proyecciones, crear, duplicar, borrar } = useProyecciones();

  const handleNueva = () => {
    const nueva = crear();
    navigate(`/herramientas/proyecciones/${nueva.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cuenta de explotación de eventos</h1>
          <p className="text-slate-500">
            Acuerdo, previsión y seguimiento real de un evento, con reparto por deal, escenarios y punto de equilibrio.
          </p>
        </div>
        <Button variant="primary" onClick={handleNueva}>Nueva proyección</Button>
      </div>
      {proyecciones.length === 0 ? (
        <p className="py-12 text-center text-slate-400">Todavía no hay proyecciones.</p>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-white">
          {proyecciones.map((p) => (
            <ProyeccionRow key={p.id} proyeccion={p} onDuplicate={duplicar} onDelete={borrar} />
          ))}
        </div>
      )}
    </div>
  );
}
