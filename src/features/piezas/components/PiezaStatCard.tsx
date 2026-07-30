import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface PiezaStatCardProps {
  value: number | string;
  label: string;
  valueClassName?: string;
}

export function PiezaStatCard({ value, label, valueClassName }: PiezaStatCardProps) {
  return (
    <Card className="border-slate-200 px-4 py-3">
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </Card>
  );
}
