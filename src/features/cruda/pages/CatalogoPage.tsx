import { useState } from 'react';
import { Button } from '@/components/ui';
import { CollectionChips } from '../components/CollectionChips';
import { ProductsTable } from '../components/ProductsTable';
import { TopProductsTable } from '../components/TopProductsTable';
import { StockAlerts } from '../components/StockAlerts';
import { ExtrasTable } from '../components/ExtrasTable';
import { VariableChips } from '../components/VariableChips';
import { ProductModal } from '../components/ProductModal';
import { products, extras, collections, variables } from '../data/seed';

export function CatalogoPage() {
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Catálogo</h1>
        <p className="text-slate-500">Colecciones y productos de CRUDA.</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Colecciones</h2>
          <span className="text-sm text-brand-700">+ Nueva colección</span>
        </div>
        <CollectionChips collections={collections} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Productos</h2>
          <Button onClick={() => setOpenProductId('new')}>+ Nuevo producto</Button>
        </div>
        <ProductsTable products={products} onOpen={setOpenProductId} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsTable products={products} />
        <StockAlerts products={products} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Extras (packaging, personalización…)</h2>
          <Button variant="secondary">+ Nuevo extra</Button>
        </div>
        <ExtrasTable extras={extras} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Variables de producto</h2>
        <p className="text-sm text-slate-400">Valores permitidos para las variantes. Al crear una variante se eligen de aquí, así fábrica recibe siempre los mismos términos.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <VariableChips label="Acabados" initial={variables.finishes} />
          <VariableChips label="Tallas" initial={variables.sizes} />
          <VariableChips label="Colores" initial={variables.colors} />
        </div>
      </section>

      <ProductModal
        open={openProductId !== null}
        productId={openProductId}
        onClose={() => setOpenProductId(null)}
      />
    </div>
  );
}
