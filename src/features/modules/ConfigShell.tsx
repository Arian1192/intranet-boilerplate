import { ModuleShell } from './ModuleShell';

export function ConfigShell() {
  return (
    <ModuleShell
      
      title="Configuración"
      description="Plantillas de correo y ajustes generales de la intranet."
      tabs={['Dashboard', 'Plantillas', 'General']}
    />
  );
}
