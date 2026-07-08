# Intranet Boilerplate

Boilerplate limpio y agnóstico a la base de datos para levantar intranets con el diseño y estructura del proyecto de referencia.

## Stack

- Vite 6
- React 19
- TypeScript 5
- Tailwind CSS 3
- React Router 7
- Lucide React

## Empezar

```bash
git clone <repo-url>
cd intranet-boilerplate
npm install
cp .env.example .env
npm run dev
```

## Configurar adaptador de datos

El boilerplate usa el patrón Repository para desacoplar la UI de la fuente de datos.

Edita `.env`:

```env
VITE_DATA_ADAPTER=mock
```

Opciones:
- `mock`: datos de prueba incluidos.
- `supabase`: stub para futura implementación.
- `rest`: stub para futura implementación.

Para conectar una base de datos real, implementa la interfaz `Repository` en `src/repositories/adapters/` y selecciónala en `.env`.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — preview del build.
- `npm run test` — tests con Vitest.
- `npm run lint` — ESLint.
- `npm run format` — Prettier.

## Estructura

```
src/
├── app/          # Router y providers
├── components/   # UI y layout
├── features/     # Páginas y hooks por feature
├── lib/          # Utilidades y constantes
├── repositories/ # Capa de datos abstracta
├── styles/       # Tailwind y CSS global
└── types/        # Tipos globales
```

## Personalizar marca

1. Cambia `VITE_APP_NAME` en `.env`.
2. Reemplaza `public/logo-placeholder.svg`.
3. Ajusta los colores `brand-*` en `tailwind.config.js`.
