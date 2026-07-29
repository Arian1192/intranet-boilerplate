export function MisCreatividadesTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Tus creatividades por fecha de entrega. El color marca lo cerca que está el deadline.
      </p>
      <div className="grid place-items-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
        No tienes creatividades asignadas ahora mismo.
      </div>
    </div>
  );
}
