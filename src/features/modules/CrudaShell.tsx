import { ModuleShell } from './ModuleShell';

export function CrudaShell() {
  return (
    <ModuleShell
      
      title="CRUDA"
      description="Catálogo, pedidos y control de stock de ropa y merch, con analítica."
      tabs={['Dashboard', 'Pedidos', 'Catálogo', 'Analítica']}
    />
  );
}
