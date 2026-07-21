import { ModuleShell } from './ModuleShell';

export function MixmagShell() {
  return (
    <ModuleShell
      title="Mixmag"
      description="Redacción Mixmag: contenidos, campañas y revistas."
      tabs={['Resumen', 'Contenidos', 'Campañas', 'Revistas']}
    />
  );
}
