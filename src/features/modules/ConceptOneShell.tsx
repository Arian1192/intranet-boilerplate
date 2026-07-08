import { ModuleShell } from './ModuleShell';

export function ConceptOneShell() {
  return (
    <ModuleShell
      
      title="Booking & Management"
      description="Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes."
      tabs={['Dashboard', 'Shows', 'Logística', 'Artistas', 'Analítica']}
    />
  );
}
