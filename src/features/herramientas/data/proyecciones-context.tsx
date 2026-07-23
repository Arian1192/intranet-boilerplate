import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Proyeccion } from './types';
import { seedProyecciones } from './seed';
import { createBlankProyeccion, duplicateProyeccion, removeProyeccion, updateProyeccion } from './proyecciones-crud';

interface ProyeccionesContextValue {
  proyecciones: Proyeccion[];
  crear: () => Proyeccion;
  duplicar: (id: string) => void;
  borrar: (id: string) => void;
  actualizar: (id: string, patch: Partial<Proyeccion>) => void;
}

const ProyeccionesContext = createContext<ProyeccionesContextValue | null>(null);

export function ProyeccionesProvider({ children }: { children: ReactNode }) {
  const [proyecciones, setProyecciones] = useState<Proyeccion[]>(seedProyecciones);

  const value = useMemo<ProyeccionesContextValue>(
    () => ({
      proyecciones,
      crear: () => {
        const nueva = createBlankProyeccion();
        setProyecciones((prev) => [...prev, nueva]);
        return nueva;
      },
      duplicar: (id) => {
        setProyecciones((prev) => {
          const original = prev.find((p) => p.id === id);
          return original ? [...prev, duplicateProyeccion(original)] : prev;
        });
      },
      borrar: (id) => setProyecciones((prev) => removeProyeccion(prev, id)),
      actualizar: (id, patch) => setProyecciones((prev) => updateProyeccion(prev, id, patch)),
    }),
    [proyecciones]
  );

  return <ProyeccionesContext.Provider value={value}>{children}</ProyeccionesContext.Provider>;
}

export function useProyecciones(): ProyeccionesContextValue {
  const ctx = useContext(ProyeccionesContext);
  if (!ctx) throw new Error('useProyecciones debe usarse dentro de <ProyeccionesProvider>');
  return ctx;
}
