import { Button } from '@/components/ui';
import type { ContractTemplate } from '../data/contratos';

export interface ContractTemplateRowProps {
  template: ContractTemplate;
}

export function ContractTemplateRow({ template }: ContractTemplateRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div>
        <span className="font-semibold text-slate-800">{template.name}</span>
        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
          {template.langCode}
        </span>
        <p className="text-sm text-slate-400">{template.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-sm">
        <Button type="button" variant="ghost" size="sm">
          Editar
        </Button>
        <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${template.name}`}>
          ✕
        </Button>
      </div>
    </div>
  );
}
