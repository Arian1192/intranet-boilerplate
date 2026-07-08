import { ModuleShell } from './ModuleShell';

export function CRMShell() {
  return (
    <ModuleShell
      
      title="CRM"
      description="Base de clientes y contactos, pipeline de oportunidades, KPIs comerciales."
      tabs={['Dashboard', 'Clientes', 'Pipeline', 'KPIs']}
    />
  );
}
