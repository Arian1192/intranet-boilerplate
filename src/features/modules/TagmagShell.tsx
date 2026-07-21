import { RedaccionShell } from '@/features/redaccion/RedaccionShell';
import { TAGMAG } from '@/features/redaccion/data/seed';

export function TagmagShell() {
  return <RedaccionShell magazine={TAGMAG} />;
}
