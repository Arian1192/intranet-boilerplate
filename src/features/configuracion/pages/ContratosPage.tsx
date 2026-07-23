import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { ContractTemplateRow } from '../components/ContractTemplateRow';
import { contractTemplates } from '../data/contratos';

export function ContratosPage() {
  const list = contractTemplates();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ConfigPageHeader
          title="Plantillas de contrato"
          subtitle="Escribe el contrato con variables {{grupo.campo}}; se rellenan con los datos del show al generarlo."
        />
        <button
          type="button"
          className="rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Nueva plantilla
        </button>
      </div>
      <Card className="p-0">
        {list.map((template) => (
          <ContractTemplateRow key={template.id} template={template} />
        ))}
      </Card>
    </div>
  );
}
