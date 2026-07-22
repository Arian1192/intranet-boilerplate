import { RedaccionShell } from '@/features/redaccion/RedaccionShell';
import { MIXMAG } from '@/features/redaccion/data/seed';

export function MixmagShell() {
  return <RedaccionShell magazine={MIXMAG} />;
}
