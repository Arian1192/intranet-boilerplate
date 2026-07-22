import { formatCurrency } from '@/lib/format';
import { CostByCompanyCard } from './CostByCompanyCard';
import { CostByPersonCard } from './CostByPersonCard';
import { companies, totalMonthlyCost, costRankingByPerson } from '../data/fichas';

export function CostDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">
        Coste mensual estimado total: <span className="font-bold">{formatCurrency(totalMonthlyCost())}</span>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <CostByCompanyCard companies={companies} total={totalMonthlyCost()} />
        <CostByPersonCard ranking={costRankingByPerson()} />
      </div>
    </div>
  );
}
