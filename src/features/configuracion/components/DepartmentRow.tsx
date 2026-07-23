import { Button } from '@/components/ui';
import type { Department, DepartmentColor } from '../data/rrhh';

// Shared with the new-department color selector in RrhhPage.
// eslint-disable-next-line react-refresh/only-export-components
export const COLOR_DOT: Record<DepartmentColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  pink: 'bg-pink-500',
  amber: 'bg-amber-500',
};

export interface DepartmentRowProps {
  department: Department;
  onToggleActive: () => void;
  onRemove: () => void;
}

export function DepartmentRow({ department, onToggleActive, onRemove }: DepartmentRowProps) {
  return (
    <div
      data-department-row
      className="flex items-center justify-between border-b border-slate-50 px-2 py-2.5 text-sm last:border-b-0"
    >
      <span className="flex items-center gap-2 text-slate-700">
        <span className={`h-2.5 w-2.5 rounded-full ${COLOR_DOT[department.color]}`} />
        {department.name}
      </span>
      <span className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={onToggleActive}>
          {department.active ? 'Desactivar' : 'Activar'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Eliminar ${department.name}`}
          onClick={onRemove}
        >
          ✕
        </Button>
      </span>
    </div>
  );
}
