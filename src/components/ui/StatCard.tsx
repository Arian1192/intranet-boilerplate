import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  caption?: string;
  valueClassName?: string;
}

export function StatCard({ label, value, change, caption, valueClassName }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      {caption && <p className="mt-0.5 text-xs text-slate-400">{caption}</p>}
      {change && <p className="text-xs text-emerald-600">{change}</p>}
    </Card>
  );
}
