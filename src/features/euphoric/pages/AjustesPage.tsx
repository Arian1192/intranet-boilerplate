import { Button, Card, Input } from '@/components/ui';
import { spaceSettings } from '../data/seed';

export function AjustesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ajustes · Euphoric Media</h1>
        <p className="text-slate-500">Parámetros de funcionamiento del espacio de Euphoric.</p>
      </div>

      <Card className="space-y-4 p-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            COLORES DEL DEADLINE DE LAS CREATIVIDADES
          </p>
          <p className="text-sm text-slate-500">
            Cada creatividad se pinta con un color según los días que faltan hasta su fecha límite:
          </p>
          <p className="text-sm text-slate-500">
            🟢 <span className="font-medium text-slate-600">verde</span> = falta más que el umbral amarillo.
          </p>
          <p className="text-sm text-slate-500">
            🟡 <span className="font-medium text-slate-600">amarillo</span> = faltan entre el umbral amarillo y el rojo
            (incluido).
          </p>
          <p className="text-sm text-slate-500">
            🔴 <span className="font-medium text-slate-600">rojo</span> = faltan 2 días o menos (incluye hoy y las
            fechas ya pasadas).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Amarillo cuando faltan (días) ≤"
              type="number"
              defaultValue={spaceSettings.deadlineYellowDays}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              A partir de este umbral (o menos), la creatividad deja de estar en verde.
            </p>
          </div>
          <div>
            <Input label="Rojo cuando faltan (días) ≤" type="number" defaultValue={spaceSettings.deadlineRedDays} />
            <p className="mt-1.5 text-xs text-slate-500">
              A este umbral o menos (incluye hoy y pasados), la creatividad se pinta en rojo.
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-slate-500">RENTABILIDAD</p>
          <p className="text-sm text-slate-500">
            Coste interno por hora que se usa para calcular la rentabilidad de cada cliente (horas imputadas ×
            coste/hora). Hasta que integremos costes reales por persona, se aplica este valor por defecto.
          </p>
        </div>
        <div className="sm:max-w-xs">
          <Input label="Coste interno por hora (€)" type="number" defaultValue={spaceSettings.hourlyCost} />
        </div>
      </Card>

      <Button>Guardar ajustes</Button>
    </div>
  );
}
