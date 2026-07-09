import { ModuleShell } from './ModuleShell';

export function EuphoricShell() {
  return (
    <ModuleShell
      title="Euphoric Media"
      description="Euphoric Media: cuentas de marketing, campañas (RRSS, paid, contenido) y calendario de publicaciones."
      tabs={['Dashboard', 'Cuentas', 'Campañas', 'Calendario']}
    />
  );
}
