import { Select } from '@/components/ui';
import type { CompanyId } from '../data/types';

export interface FichasFilterPanelProps {
  companyId: CompanyId | 'todas';
  onCompany: (id: CompanyId | 'todas') => void;
  type: 'contratado' | 'freelance' | 'todos';
  onType: (type: 'contratado' | 'freelance' | 'todos') => void;
}

export function FichasFilterPanel({ companyId, onCompany, type, onType }: FichasFilterPanelProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#44444C] px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        + Nueva persona
      </button>
      <Select
        label="Empresa"
        value={companyId}
        onChange={(e) => onCompany(e.target.value as CompanyId | 'todas')}
      >
        <option value="todas">Todas</option>
        <option value="conceptone">ConceptOne</option>
        <option value="cruda">CRUDA</option>
        <option value="etra">Etra Agency</option>
        <option value="euphoric">Euphoric Media</option>
        <option value="mixmag">Mixmag Spain</option>
        <option value="tagmag">TAGMAG</option>
      </Select>
      <Select
        label="Tipo"
        value={type}
        onChange={(e) => onType(e.target.value as 'contratado' | 'freelance' | 'todos')}
      >
        <option value="todos">Todos</option>
        <option value="contratado">Contratado</option>
        <option value="freelance">Freelance</option>
      </Select>
    </div>
  );
}
