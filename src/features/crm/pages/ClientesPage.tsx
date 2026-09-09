import { OrgExplorer } from '../components/OrgExplorer';

/**
 * `/crm/clientes`.
 *
 * El cuerpo vive en `OrgExplorer` porque el live lo enseña en dos sitios: aquí
 * y empotrado en la pestaña «Empresas» de `/contactos`. Aquí sí lleva su
 * buscador propio; allí no.
 *
 * Nota de rutas, medida el 2026-09-09: en el live esta pantalla está en `/crm`
 * a secas — `/crm/clientes` cae en su catch-all y pinta el home. También existe
 * una `/crm/kpis` que nosotros no tenemos. No se toca aquí: `router.tsx` está
 * congelado y es de otro módulo.
 */
export function ClientesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Clientes</h1>
        <p className="text-sm text-slate-500">
          CRM del grupo: organizaciones (clientes, proveedores, leads) y sus contactos.
        </p>
      </div>

      <OrgExplorer />
    </div>
  );
}
