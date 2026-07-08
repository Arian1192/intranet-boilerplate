import { Card } from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
}

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {change && <p className="text-xs text-emerald-600">{change}</p>}
    </Card>
  );
}
