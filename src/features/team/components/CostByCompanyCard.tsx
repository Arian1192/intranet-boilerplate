import { formatCurrency } from '@/lib/format';
import { ProgressBar } from '@/components/ui';
import type { Company } from '../data/types';

export interface CostByCompanyCardProps {
  companies: Company[];
}

export function CostByCompanyCard({ companies }: CostByCompanyCardProps) {
  const max = Math.max(...companies.map((c) => c.monthlyCost));
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500">COSTE POR EMPRESA</h3>
      <div className="mt-3 space-y-3">
        {companies.map((company) => (
          <div key={company.id} className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: company.colorHex }} />
              <span className="flex-1">{company.name}</span>
              <span className="font-medium">{formatCurrency(company.monthlyCost)}</span>
            </div>
            <ProgressBar value={company.monthlyCost} max={max} fillClassName="bg-slate-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
