import { Card } from '@/components/ui';
import { seccionesInfo } from '../data/textos-info';

interface Props {
  onClose: () => void;
}

/**
 * Panel "¿Cómo se calcula?" (toggle desde el botón "i" de la toolbar). Se muestra bajo las
 * tabs, sobre el contenido. 6 subsecciones fijas en grid 3×2 (copy en `textos-info.ts`).
 */
export function InfoComoSeCalcula({ onClose }: Props) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">¿Cómo se calcula?</h3>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          ×
        </button>
      </div>
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-3">
        {seccionesInfo.map((s) => (
          <div key={s.titulo}>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-700">{s.titulo}</p>
            <p className="text-sm leading-relaxed text-slate-500">{s.texto}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
