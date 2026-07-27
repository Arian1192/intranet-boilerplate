import { Card } from '@/components/ui';

export function TabPlaceholder({ fase }: { fase: 'B' | 'C' }) {
  return (
    <Card className="p-12 text-center">
      <p className="text-slate-500">Esta vista se construye en la Fase {fase}.</p>
    </Card>
  );
}
