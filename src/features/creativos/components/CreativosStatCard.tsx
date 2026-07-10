import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface CreativosStatCardProps {
  value: number | string;
  label: string;
  valueClassName?: string;
}

export function CreativosStatCard({ value, label, valueClassName }: CreativosStatCardProps) {
  return (
    <Card className="border-slate-200 px-4 py-3">
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </Card>
  );
}
