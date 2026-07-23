import { Select } from '@/components/ui';

export interface DirectorioToolbarProps {
  query: string;
  onQuery: (q: string) => void;
  departments: string[];
  department: string;
  onDepartment: (d: string) => void;
}

export function DirectorioToolbar({ query, onQuery, departments, department, onDepartment }: DirectorioToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar por nombre, puesto o email..."
        className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
      <Select
        aria-label="Departamento"
        value={department}
        onChange={(e) => onDepartment(e.target.value)}
        className="sm:w-56"
      >
        <option value="">Todos los departamentos</option>
        {departments.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
    </div>
  );
}
