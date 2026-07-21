import { ModuleShell } from './ModuleShell';

export function TagmagShell() {
  return (
    <ModuleShell
      title="TAGMAG"
      description="Redacción TAGMAG: contenidos, campañas y revistas."
      tabs={['Resumen', 'Contenidos', 'Campañas', 'Revistas']}
    />
  );
}
