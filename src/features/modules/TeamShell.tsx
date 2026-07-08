import { ModuleShell } from './ModuleShell';

export function TeamShell() {
  return (
    <ModuleShell
      
      title="Team"
      description="Personas del grupo, condiciones y RRHH, vacaciones y gestión de usuarios."
      tabs={['Dashboard', 'Equipo', 'Vacaciones']}
    />
  );
}
