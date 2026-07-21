import { ModuleShell } from './ModuleShell';

export function HerramientasShell() {
  return (
    <ModuleShell
      title="Herramientas"
      description="Utilidades transversales del grupo: proyecciones y P&L de eventos."
      tabs={['Herramientas', 'Proyecciones']}
    />
  );
}
