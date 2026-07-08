# Boilerplate Intranet — Fase 1: Fundación + Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first phase of the brand-neutral intranet boilerplate: Vite+React+TypeScript+Tailwind project, design system, shared UI components, layout shell, login page, dashboard home, placeholder module routes, and a database-agnostic repository layer with mock adapter.

**Architecture:** Layered React SPA where components consume data through a typed `Repository` interface exposed via React Context. The active adapter is selected via environment variable; the default `MockRepository` returns fixtures, while `SupabaseAdapter`/`RestAdapter` are stubs for future phases.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide React, ESLint, Prettier, Vitest (for smoke tests).

## Global Constraints

- All code is TypeScript with strict mode enabled.
- No component fetches directly from external services; all data access goes through the repository context.
- No real brand names, credentials, production URLs, or real person/event data are committed.
- The active data adapter is controlled by `VITE_DATA_ADAPTER` (valid values: `mock`, `supabase`, `rest`).
- Brand colors are Tailwind config tokens (`brand-*`) and CSS variables, not hardcoded hex values in components.
- Module names and app name are constants in `src/lib/constants.ts`.
- Every task ends with a git commit.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Modify: `.gitignore` (add dist, *.local, .env)

**Interfaces:**
- Produces: runnable Vite dev server at `http://localhost:5173`.

- [ ] **Step 1: Create package.json**

`package.json`:
```json
{
  "name": "intranet-boilerplate",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\""
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.38",
    "prettier": "^3.2.5",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^6.0.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd /home/arian/dev/Boilerplate
npm install
```

- [ ] **Step 3: Configure TypeScript**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Configure Vite, ESLint and Prettier**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

`.eslintrc.cjs`:
```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

`.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173` and shows the default Vite + React page.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold vite react ts project"
```

---

## Task 2: Tailwind Configuration and Global Styles

**Files:**
- Create: `src/styles/index.css`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `index.html` (add Inter font)
- Modify: `src/main.tsx` (import styles)

**Interfaces:**
- Produces: Tailwind utility classes including `bg-brand-600`, `text-slate-500`, etc.
- Produces: global CSS variables for design tokens.

- [ ] **Step 1: Configure PostCSS**

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Configure Tailwind with custom colors**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        status: {
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          neutral: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Add global styles**

`src/styles/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
    font-family: theme('fontFamily.sans');
  }
}
```

- [ ] **Step 4: Import styles in main entry**

`src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@/app/App';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 5: Verify Tailwind classes work**

Replace `src/app/App.tsx` temporarily with:
```tsx
export default function App() {
  return <div className="p-8 text-brand-600 font-bold">Tailwind works</div>;
}
```

Run `npm run dev` and confirm the styled text appears.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: configure tailwind design tokens and global styles"
```

---

## Task 3: Shared UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Avatar.tsx`
- Create: `src/components/ui/index.ts`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/Button.test.tsx`
- Modify: `vite.config.ts` (add vitest config)

**Interfaces:**
- Produces: reusable `Button`, `Card`, `Badge`, `Input`, `Avatar` components with typed props.
- Produces: `cn()` utility for conditional classes.

- [ ] **Step 1: Add class merge utility**

`src/lib/utils.ts`:
```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Implement Button component**

`src/components/ui/Button.tsx`:
```tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-600 text-white hover:bg-brand-700': variant === 'primary',
            'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50': variant === 'secondary',
            'text-slate-600 hover:bg-slate-100': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

- [ ] **Step 3: Implement Card component**

`src/components/ui/Card.tsx`:
```tsx
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-100 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Implement Badge component**

`src/components/ui/Badge.tsx`:
```tsx
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-blue-50 text-blue-700': variant === 'info',
          'bg-green-50 text-green-700': variant === 'success',
          'bg-yellow-50 text-yellow-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'danger',
          'bg-slate-100 text-slate-600': variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 5: Implement Input component**

`src/components/ui/Input.tsx`:
```tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

- [ ] **Step 6: Implement Avatar component**

`src/components/ui/Avatar.tsx`:
```tsx
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const initials = fallback.slice(0, 2).toUpperCase();
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-600 text-white font-medium',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || fallback} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create component barrel export**

`src/components/ui/index.ts`:
```ts
export * from './Button';
export * from './Card';
export * from './Badge';
export * from './Input';
export * from './Avatar';
```

- [ ] **Step 8: Add a smoke test**

`src/components/ui/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders primary variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Run tests**

```bash
npm run test
```

Expected: 1 passing test.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: add shared ui components with smoke tests"
```

---

## Task 4: Layout Shell Components

**Files:**
- Create: `src/components/layout/TopNav.tsx`
- Create: `src/components/layout/ModuleSelector.tsx`
- Create: `src/components/layout/UserMenu.tsx`
- Create: `src/components/layout/AppLayout.tsx`
- Create: `src/components/layout/index.ts`
- Create: `src/lib/constants.ts`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `User` type from `src/types/index.ts`.
- Produces: `AppLayout` wrapping pages with top navigation and module selector.

- [ ] **Step 1: Define global types**

`src/types/index.ts`:
```ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
}

export interface Module {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
  category: 'business' | 'internal';
}

export interface NewsItem {
  id: string;
  author: string;
  scope: string;
  date: string;
  title: string;
  scheduledFor?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  location: string;
  status: 'confirmed' | 'in-production' | 'tentative';
}

export interface Reminder {
  id: string;
  title: string;
}

export interface Dashboard {
  greeting: string;
  birthdayNotice?: string;
  weather: string;
  modules: Module[];
  news: NewsItem[];
  upcomingEvents: Event[];
  reminders: Reminder[];
}
```

- [ ] **Step 2: Define app constants**

`src/lib/constants.ts`:
```ts
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Intranet';
export const APP_SHORT_NAME = import.meta.env.VITE_APP_SHORT_NAME || 'Intranet';

export const MODULES = [
  {
    id: 'conceptone',
    slug: 'conceptone',
    name: 'Booking & Management',
    shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.',
    icon: 'Headphones',
    category: 'business',
  },
  {
    id: 'etra',
    slug: 'etra',
    name: 'Comunicación & PR',
    shortDescription: 'Lleva las cuentas de PR, las acciones del equipo y el seeding a influencers.',
    icon: 'Megaphone',
    category: 'business',
  },
  {
    id: 'produccion',
    slug: 'produccion',
    name: 'Producción',
    shortDescription: 'Base de datos de eventos y producciones: calendario, tareas, responsables y presupuesto.',
    icon: 'Calendar',
    category: 'business',
  },
  {
    id: 'cruda',
    slug: 'cruda',
    name: 'CRUDA',
    shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch, con analítica.',
    icon: 'Shirt',
    category: 'business',
  },
  {
    id: 'crm',
    slug: 'crm',
    name: 'CRM',
    shortDescription: 'Base de clientes y contactos, pipeline de oportunidades, KPIs comerciales.',
    icon: 'Target',
    category: 'internal',
  },
  {
    id: 'personal',
    slug: 'personal',
    name: 'Team',
    shortDescription: 'Personas del grupo, condiciones y RRHH, vacaciones y gestión de usuarios.',
    icon: 'Users',
    category: 'internal',
  },
  {
    id: 'configuracion',
    slug: 'configuracion',
    name: 'Configuración',
    shortDescription: 'Plantillas de correo y ajustes generales de la intranet.',
    icon: 'Settings',
    category: 'internal',
  },
] as const;
```

- [ ] **Step 3: Implement TopNav**

`src/components/layout/TopNav.tsx`:
```tsx
import { Bell } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { UserMenu } from './UserMenu';
import type { User } from '@/types';

export interface TopNavProps {
  user: User;
  notificationCount?: number;
}

export function TopNav({ user, notificationCount = 0 }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            {APP_NAME.charAt(0)}
          </div>
          <span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            )}
          </button>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Implement UserMenu**

`src/components/layout/UserMenu.tsx`:
```tsx
import { Avatar } from '@/components/ui';
import type { User } from '@/types';

export interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <button className="hidden items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex">
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">{user.name}</p>
        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
      </div>
      <Avatar fallback={user.name} size="md" src={user.avatar} />
    </button>
  );
}
```

- [ ] **Step 5: Implement ModuleSelector**

`src/components/layout/ModuleSelector.tsx`:
```tsx
import { MODULES } from '@/lib/constants';
import { Link, useLocation } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

export function ModuleSelector() {
  const location = useLocation();
  const activeModule = MODULES.find((m) => location.pathname.startsWith(`/${m.slug}`));

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {MODULES.filter((m) => m.category === 'business').map((module) => {
        const Icon = Icons[module.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        const isActive = activeModule?.id === module.id;
        return (
          <Link
            key={module.id}
            to={`/${module.slug}`}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {module.name}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 6: Implement AppLayout**

`src/components/layout/AppLayout.tsx`:
```tsx
import { TopNav } from './TopNav';
import type { User } from '@/types';

export interface AppLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function AppLayout({ user, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav user={user} notificationCount={7} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 7: Create layout barrel export**

`src/components/layout/index.ts`:
```ts
export * from './AppLayout';
export * from './TopNav';
export * from './UserMenu';
export * from './ModuleSelector';
```

- [ ] **Step 8: Verify layout renders**

Temporarily update `src/app/App.tsx`:
```tsx
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export default function App() {
  return (
    <AppLayout user={mockUser}>
      <div className="text-slate-600">Layout works</div>
    </AppLayout>
  );
}
```

Run `npm run dev` and confirm the top navigation appears.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add layout shell components"
```

---

## Task 5: Database-Agnostic Repository Layer

**Files:**
- Create: `src/repositories/types.ts`
- Create: `src/repositories/RepositoryContext.ts`
- Create: `src/repositories/RepositoryProvider.tsx`
- Create: `src/repositories/MockRepository.ts`
- Create: `src/repositories/adapters/SupabaseAdapter.ts`
- Create: `src/repositories/adapters/RestAdapter.ts`
- Create: `src/repositories/index.ts`
- Create: `src/repositories/MockRepository.test.ts`

**Interfaces:**
- Produces: `Repository` interface and `RepositoryProvider` React context.
- Produces: `createRepository(adapter: string)` factory.
- Produces: typed fixtures for dashboard data.

- [ ] **Step 1: Define Repository interface**

`src/repositories/types.ts`:
```ts
import type { Dashboard, User, UserSession } from '@/types';

export interface Repository {
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  getDashboard(): Promise<Dashboard>;
}
```

- [ ] **Step 2: Create Repository context**

`src/repositories/RepositoryContext.ts`:
```ts
import { createContext, useContext } from 'react';
import type { Repository } from './types';

export const RepositoryContext = createContext<Repository | null>(null);

export function useRepository(): Repository {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return ctx;
}
```

- [ ] **Step 3: Create RepositoryProvider**

`src/repositories/RepositoryProvider.tsx`:
```tsx
import { RepositoryContext } from './RepositoryContext';
import type { Repository } from './types';

export interface RepositoryProviderProps {
  repository: Repository;
  children: React.ReactNode;
}

export function RepositoryProvider({ repository, children }: RepositoryProviderProps) {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
}
```

- [ ] **Step 4: Implement MockRepository with fixtures**

`src/repositories/MockRepository.ts`:
```ts
import type { Dashboard, User, UserSession } from '@/types';
import { APP_NAME } from '@/lib/constants';
import type { Repository } from './types';

export class MockRepository implements Repository {
  private latency = 300;

  private delay<T>(value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), this.latency));
  }

  async login(email: string, password: string): Promise<UserSession> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    return this.delay({
      user: {
        id: 'user-1',
        email,
        name: 'Test User',
        role: 'Admin',
      },
      accessToken: 'mock-token',
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return this.delay({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'Admin',
    });
  }

  async logout(): Promise<void> {
    return this.delay(undefined);
  }

  async getDashboard(): Promise<Dashboard> {
    return this.delay({
      greeting: 'Hola, Test',
      birthdayNotice: `El cumple de un compañero es en 3 días 🎂`,
      weather: 'Barcelona · 34° / 23°',
      modules: [
        {
          id: 'conceptone',
          slug: 'conceptone',
          name: 'Booking & Management',
          shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.',
          icon: 'Headphones',
          category: 'business',
        },
        {
          id: 'etra',
          slug: 'etra',
          name: 'Comunicación & PR',
          shortDescription: 'Lleva las cuentas de PR, las acciones del equipo y el seeding a influencers.',
          icon: 'Megaphone',
          category: 'business',
        },
        {
          id: 'produccion',
          slug: 'produccion',
          name: 'Producción',
          shortDescription: 'Base de datos de eventos y producciones: calendario, tareas, responsables y presupuesto.',
          icon: 'Calendar',
          category: 'business',
        },
        {
          id: 'cruda',
          slug: 'cruda',
          name: 'CRUDA',
          shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch, con analítica.',
          icon: 'Shirt',
          category: 'business',
        },
        {
          id: 'crm',
          slug: 'crm',
          name: 'CRM',
          shortDescription: 'Base de clientes y contactos, pipeline de oportunidades, KPIs comerciales.',
          icon: 'Target',
          category: 'internal',
        },
        {
          id: 'personal',
          slug: 'personal',
          name: 'Team',
          shortDescription: 'Personas del grupo, condiciones y RRHH, vacaciones y gestión de usuarios.',
          icon: 'Users',
          category: 'internal',
        },
        {
          id: 'configuracion',
          slug: 'configuracion',
          name: 'Configuración',
          shortDescription: 'Plantillas de correo y ajustes generales de la intranet.',
          icon: 'Settings',
          category: 'internal',
        },
      ],
      news: [
        {
          id: 'news-1',
          author: 'Carlos Pego',
          scope: 'Grupo',
          date: '06 jul 2026',
          title: 'Comida de verano, ganas de pasar un rato con todos vosotros! 🍻',
          scheduledFor: 'Programada 09 jul 2026',
          actionLabel: 'Confirmar asistencia',
          actionHref: '#',
        },
        {
          id: 'news-2',
          author: 'Carlos Pego',
          scope: 'Grupo',
          date: '05 jul 2026',
          title: 'Teletrabajo hasta el 7 de julio incluido',
        },
      ],
      upcomingEvents: [
        {
          id: 'event-1',
          title: 'Mixmag Intimate Sessions: BLOND:ISH',
          date: '15 jul 2026',
          timeRange: '20:00–21:30',
          location: 'Soho Farmhouse, Ibiza',
          status: 'confirmed',
        },
        {
          id: 'event-2',
          title: 'Please Quiet x SIGHT',
          date: '18 jul 2026',
          timeRange: '18:00–23:00',
          location: 'Cósmico - SLS Barcelona, Barcelona',
          status: 'in-production',
        },
      ],
      reminders: [],
    });
  }
}
```

- [ ] **Step 5: Create adapter stubs**

`src/repositories/adapters/SupabaseAdapter.ts`:
```ts
import type { Dashboard, User, UserSession } from '@/types';
import type { Repository } from '../types';

export class SupabaseAdapter implements Repository {
  async login(_email: string, _password: string): Promise<UserSession> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async logout(): Promise<void> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async getDashboard(): Promise<Dashboard> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }
}
```

`src/repositories/adapters/RestAdapter.ts`:
```ts
import type { Dashboard, User, UserSession } from '@/types';
import type { Repository } from '../types';

export class RestAdapter implements Repository {
  async login(_email: string, _password: string): Promise<UserSession> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async logout(): Promise<void> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async getDashboard(): Promise<Dashboard> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }
}
```

- [ ] **Step 6: Create factory and barrel export**

`src/repositories/index.ts`:
```ts
export * from './types';
export * from './RepositoryContext';
export * from './RepositoryProvider';
export { MockRepository } from './MockRepository';
export { SupabaseAdapter } from './adapters/SupabaseAdapter';
export { RestAdapter } from './adapters/RestAdapter';

import { MockRepository } from './MockRepository';
import { SupabaseAdapter } from './adapters/SupabaseAdapter';
import { RestAdapter } from './adapters/RestAdapter';
import type { Repository } from './types';

export function createRepository(adapter: string): Repository {
  switch (adapter) {
    case 'supabase':
      return new SupabaseAdapter();
    case 'rest':
      return new RestAdapter();
    case 'mock':
    default:
      return new MockRepository();
  }
}
```

- [ ] **Step 7: Add repository test**

`src/repositories/MockRepository.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository', () => {
  it('returns a dashboard with modules and events', async () => {
    const repo = new MockRepository();
    const dashboard = await repo.getDashboard();
    expect(dashboard.modules.length).toBeGreaterThan(0);
    expect(dashboard.upcomingEvents.length).toBeGreaterThan(0);
  });

  it('returns a user session on login', async () => {
    const repo = new MockRepository();
    const session = await repo.login('test@example.com', 'password');
    expect(session.user.email).toBe('test@example.com');
    expect(session.accessToken).toBeDefined();
  });
});
```

- [ ] **Step 8: Run tests**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add repository abstraction layer with mock adapter"
```

---

## Task 6: Login Page

**Files:**
- Create: `src/features/auth/LoginPage.tsx`
- Create: `src/features/auth/hooks/useLogin.ts`
- Create: `src/app/router.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `Repository` from context.
- Consumes: `Button`, `Input`, `Card` components.
- Produces: `/login` route with working form UI.

- [ ] **Step 1: Implement useLogin hook**

`src/features/auth/hooks/useLogin.ts`:
```ts
import { useState, useCallback } from 'react';
import { useRepository } from '@/repositories';
import type { UserSession } from '@/types';

interface UseLoginResult {
  login: (email: string, password: string) => Promise<UserSession>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginResult {
  const repository = useRepository();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const session = await repository.login(email, password);
        return session;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [repository]
  );

  return { login, isLoading, error };
}
```

- [ ] **Step 2: Implement LoginPage**

`src/features/auth/LoginPage.tsx`:
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Input } from '@/components/ui';
import { APP_NAME } from '@/lib/constants';
import { useLogin } from './hooks/useLogin';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error is already handled in hook
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">
          {APP_NAME.charAt(0)}
        </div>
        <span className="text-2xl font-bold text-slate-900">{APP_NAME}</span>
      </div>

      <Card className="w-full max-w-md p-8">
        <h1 className="mb-2 text-center text-xl font-semibold text-slate-900">
          Calculadora de liquidaciones de shows
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿Sin cuenta? Pídele a un administrador que te dé de alta.
        </p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Set up router**

`src/app/router.tsx`:
```tsx
import { Routes, Route } from 'react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';
import { EtraShell } from '@/features/modules/EtraShell';
import { ProduccionShell } from '@/features/modules/ProduccionShell';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { CRMShell } from '@/features/modules/CRMShell';
import { TeamShell } from '@/features/modules/TeamShell';
import { ConfigShell } from '@/features/modules/ConfigShell';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/conceptone" element={<ConceptOneShell />} />
      <Route path="/etra" element={<EtraShell />} />
      <Route path="/produccion" element={<ProduccionShell />} />
      <Route path="/cruda" element={<CrudaShell />} />
      <Route path="/crm" element={<CRMShell />} />
      <Route path="/personal" element={<TeamShell />} />
      <Route path="/configuracion" element={<ConfigShell />} />
    </Routes>
  );
}
```

- [ ] **Step 4: Wire App with repository and router**

`src/app/App.tsx`:
```tsx
import { AppRouter } from './router';
import { RepositoryProvider, createRepository } from '@/repositories';

const repository = createRepository(import.meta.env.VITE_DATA_ADAPTER || 'mock');

export default function App() {
  return (
    <RepositoryProvider repository={repository}>
      <AppRouter />
    </RepositoryProvider>
  );
}
```

- [ ] **Step 5: Verify login page**

Run `npm run dev`, navigate to `/login`, and confirm the styled form appears and submits navigate to `/`.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add login page with repository-backed auth hook"
```

---

## Task 7: Dashboard Home Page

**Files:**
- Create: `src/features/dashboard/DashboardPage.tsx`
- Create: `src/features/dashboard/ModuleGrid.tsx`
- Create: `src/features/dashboard/NewsFeed.tsx`
- Create: `src/features/dashboard/UpcomingEvents.tsx`
- Create: `src/features/dashboard/Reminders.tsx`
- Create: `src/features/dashboard/hooks/useDashboard.ts`
- Modify: `src/components/layout/TopNav.tsx` (optional: integrate module selector)

**Interfaces:**
- Consumes: `Dashboard`, `Module`, `NewsItem`, `Event`, `Reminder` types.
- Consumes: `Repository` from context.
- Produces: dashboard page matching reference layout.

- [ ] **Step 1: Implement useDashboard hook**

`src/features/dashboard/hooks/useDashboard.ts`:
```ts
import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Dashboard } from '@/types';

export function useDashboard() {
  const repository = useRepository();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getDashboard()
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { dashboard, isLoading, error };
}
```

- [ ] **Step 2: Implement ModuleGrid**

`src/features/dashboard/ModuleGrid.tsx`:
```tsx
import { Card } from '@/components/ui';
import type { Module } from '@/types';
import * as Icons from 'lucide-react';
import { Link } from 'react-router';

export interface ModuleGridProps {
  modules: Module[];
  title: string;
}

export function ModuleGrid({ modules, title }: ModuleGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = Icons[module.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
          return (
            <Link
              key={module.id}
              to={`/${module.slug}`}
              className="group block rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <h3 className="mb-1 font-semibold text-slate-900">{module.name}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{module.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement NewsFeed**

`src/features/dashboard/NewsFeed.tsx`:
```tsx
import { Card, Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Novedades</h2>
        <button className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-500 hover:bg-brand-50 hover:text-brand-600">
          +
        </button>
      </div>
      <Card className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {item.author.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{item.author}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{item.scope}</span>
                <span>·</span>
                <span>{item.date}</span>
                {item.scheduledFor && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                    {item.scheduledFor}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.actionLabel && (
                <Button variant="primary" size="sm">
                  {item.actionLabel}
                </Button>
              )}
              <button className="text-slate-300 hover:text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
```

- [ ] **Step 4: Implement UpcomingEvents**

`src/features/dashboard/UpcomingEvents.tsx`:
```tsx
import { Card, Badge } from '@/components/ui';
import type { Event } from '@/types';
import { Ticket } from 'lucide-react';

export interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        Próximos eventos
      </h2>
      <Card className="divide-y divide-slate-100">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 p-4 hover:bg-slate-50">
            <div className="mt-0.5 text-slate-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500">
                {event.date} · {event.timeRange} · {event.location}
              </p>
            </div>
            <Badge variant={event.status === 'confirmed' ? 'success' : 'warning'}>
              {event.status === 'confirmed' ? 'Confirmado' : 'En producción'}
            </Badge>
          </div>
        ))}
      </Card>
    </section>
  );
}
```

- [ ] **Step 5: Implement Reminders**

`src/features/dashboard/Reminders.tsx`:
```tsx
import { Card } from '@/components/ui';
import type { Reminder } from '@/types';
import { Bell } from 'lucide-react';

export interface RemindersProps {
  reminders: Reminder[];
}

export function Reminders({ reminders }: RemindersProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        Mis recordatorios
      </h2>
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-3 text-slate-300">
          <Bell className="h-8 w-8" />
        </div>
        <p className="font-medium text-slate-700">Aún no tienes recordatorios.</p>
        <p className="text-sm text-slate-500">
          Pronto podrás crear aquí tus tareas y recordatorios personales.
        </p>
      </Card>
    </section>
  );
}
```

- [ ] **Step 6: Implement DashboardPage**

`src/features/dashboard/DashboardPage.tsx`:
```tsx
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import { useDashboard } from './hooks/useDashboard';
import { ModuleGrid } from './ModuleGrid';
import { NewsFeed } from './NewsFeed';
import { UpcomingEvents } from './UpcomingEvents';
import { Reminders } from './Reminders';

export function DashboardPage() {
  const { dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <AppLayout user={{ id: '1', email: '', name: 'Cargando...', role: '' }}>
        <div className="flex h-64 items-center justify-center text-slate-500">Cargando...</div>
      </AppLayout>
    );
  }

  if (error || !dashboard) {
    return (
      <AppLayout user={{ id: '1', email: '', name: 'Error', role: '' }}>
        <Card className="p-6 text-red-600">Error: {error || 'No data'}</Card>
      </AppLayout>
    );
  }

  const businessModules = dashboard.modules.filter((m) => m.category === 'business');
  const internalModules = dashboard.modules.filter((m) => m.category === 'internal');

  return (
    <AppLayout user={{ id: '1', email: 'test@example.com', name: dashboard.greeting.replace('Hola, ', ''), role: 'Admin' }}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">{dashboard.greeting} 👋🏼</h1>
          {dashboard.birthdayNotice && (
            <p className="mt-1 text-slate-500">{dashboard.birthdayNotice}</p>
          )}
          <p className="mt-1 text-sm text-slate-400">{dashboard.weather}</p>
        </div>

        <NewsFeed items={dashboard.news} />

        <ModuleGrid modules={businessModules} title="Tus espacios" />
        <ModuleGrid modules={internalModules} title="Uso interno" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingEvents events={dashboard.upcomingEvents} />
          </div>
          <div>
            <Reminders reminders={dashboard.reminders} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
```

- [ ] **Step 7: Verify dashboard**

Run `npm run dev`, log in, and confirm the dashboard renders with modules, news, events, and reminders.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add dashboard home page with mock data"
```

---

## Task 8: Module Shell Routes

**Files:**
- Create: `src/features/modules/ConceptOneShell.tsx`
- Create: `src/features/modules/EtraShell.tsx`
- Create: `src/features/modules/ProduccionShell.tsx`
- Create: `src/features/modules/CrudaShell.tsx`
- Create: `src/features/modules/CRMShell.tsx`
- Create: `src/features/modules/TeamShell.tsx`
- Create: `src/features/modules/ConfigShell.tsx`
- Create: `src/features/modules/ModuleShell.tsx`

**Interfaces:**
- Consumes: `AppLayout`, `Card`.
- Produces: placeholder pages for each module route.

- [ ] **Step 1: Create reusable ModuleShell**

`src/features/modules/ModuleShell.tsx`:
```tsx
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import type { User } from '@/types';

export interface ModuleShellProps {
  title: string;
  description: string;
}

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function ModuleShell({ title, description }: ModuleShellProps) {
  return (
    <AppLayout user={mockUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500">{description}</p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-slate-500">Contenido del módulo en desarrollo.</p>
          <p className="mt-2 text-sm text-slate-400">
            Esta página es un placeholder para la próxima fase.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
```

- [ ] **Step 2: Create module shells**

`src/features/modules/ConceptOneShell.tsx`:
```tsx
import { ModuleShell } from './ModuleShell';

export function ConceptOneShell() {
  return (
    <ModuleShell
      title="Booking & Management"
      description="Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes."
    />
  );
}
```

Create similar files for `EtraShell`, `ProduccionShell`, `CrudaShell`, `CRMShell`, `TeamShell`, `ConfigShell` with appropriate titles and descriptions.

- [ ] **Step 3: Verify navigation**

Run `npm run dev`, click each module in the dashboard or navigate directly to each route. Confirm all render inside the shared layout.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add placeholder module shells and routes"
```

---

## Task 9: Style Guide and Project Documentation

**Files:**
- Create: `docs/STYLE_GUIDE.md`
- Create: `README.md`
- Create: `.env.example`

**Interfaces:**
- Produces: `docs/STYLE_GUIDE.md` documenting design tokens and components.
- Produces: `README.md` with setup and adapter instructions.
- Produces: `.env.example` template.

- [ ] **Step 1: Write STYLE_GUIDE.md**

`docs/STYLE_GUIDE.md`:
```markdown
# Style Guide — Boilerplate Intranet

## Purpose

This document defines the visual language and component conventions for the boilerplate. Future agents should read this before adding new pages or components to keep the UI consistent.

## Colors

### Brand

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#F5F3FF` | Hover backgrounds, light accents |
| `brand-100` | `#EDE9FE` | Light badges |
| `brand-600` | `#7C3AED` | Primary buttons, links, active nav |
| `brand-700` | `#6D28D9` | Primary hover |

### Neutrals

Use `slate-*` for text, borders, and backgrounds. Prefer `slate-50` for page background, `slate-100` for borders, `slate-500` for secondary text, `slate-900` for headings.

### Status

| Token | Hex | Meaning |
|-------|-----|---------|
| `status-info` / blue | `#3B82F6` | Info, pending |
| `status-success` / green | `#10B981` | Confirmed, done |
| `status-warning` / yellow | `#F59E0B` | Warning, in progress |
| `status-danger` / red | `#EF4444` | Error, overdue |
| `status-neutral` / slate | `#94A3B8` | Tentative, inactive |

## Typography

- Font: `Inter`, fallback `system-ui`.
- Headings: semibold/bold, tight leading.
- Body: normal weight, relaxed leading.
- Labels: uppercase, bold, wide tracking, small size.

## Spacing

- Page padding: `p-6` to `p-8`.
- Card padding: `p-5` to `p-6`.
- Section gaps: `space-y-8`.
- Card border radius: `rounded-xl`.
- Button radius: `rounded-lg`.

## Components

### Button

Variants: `primary`, `secondary`, `ghost`, `danger`.
Sizes: `sm`, `md`, `lg`.

Primary buttons use `bg-brand-600 text-white hover:bg-brand-700`.

### Card

Always use the `Card` component. It provides `rounded-xl`, `bg-white`, `border-slate-100`, and `shadow-sm`.

### Badge

Map status semantics to badge variants. Do not invent new badge colors.

### Input

Use the `Input` component with `label` and optional `error` props. Never style raw inputs directly.

### Avatar

Use initials fallback. Sizes: `sm`, `md`, `lg`.

## Layout

- Top navigation is sticky with a subtle blur backdrop.
- Main content is centered with `max-w-7xl`.
- Module selector lives in the top nav.

## Do's and Don'ts

- Do use the repository layer for data; never call APIs from components.
- Do use constants from `src/lib/constants.ts` for module names and app config.
- Don't hardcode brand colors; use Tailwind tokens.
- Don't commit real brand names, credentials, or production URLs.
```

- [ ] **Step 2: Write README.md**

`README.md`:
```markdown
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
```

- [ ] **Step 3: Create .env.example**

`.env.example`:
```env
# App config
VITE_APP_NAME=Intranet
VITE_APP_SHORT_NAME=Intranet

# Data adapter: mock | supabase | rest
VITE_DATA_ADAPTER=mock

# Supabase config (only needed when VITE_DATA_ADAPTER=supabase)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 4: Verify docs render**

Preview `README.md` in the editor and ensure no broken formatting.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "docs: add style guide, readme and env example"
```

---

## Task 10: Final Verification and GitHub Push

**Files:**
- Modify: `.gitignore` (ensure .env is ignored)
- Modify: remote git repository

**Interfaces:**
- Produces: repo pushed to GitHub.

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: `dist/` is generated without errors.

- [ ] **Step 4: Verify .env is ignored**

```bash
git status
```

Expected: `.env` does not appear as untracked/staged.

- [ ] **Step 5: Add GitHub remote and push**

```bash
git remote add origin <GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

Replace `<GITHUB_REPO_URL>` with the actual GitHub repository URL provided by the user.

- [ ] **Step 6: Commit any final fixes**

```bash
git add .
git commit -m "chore: final verification and polish"
git push
```

---

## Plan Self-Review

### Spec coverage

- Project setup: Task 1.
- Tailwind design tokens: Task 2.
- Shared UI components: Task 3.
- Layout shell: Task 4.
- Repository abstraction + mock adapter: Task 5.
- Login page: Task 6.
- Dashboard home: Task 7.
- Module shells + routing: Task 8.
- Documentation: Task 9.
- GitHub boilerplate setup: Task 10.

### Placeholder scan

No TBD/TODO/fill-in-later steps. GitHub URL is the only variable, which must be provided by the user at push time.

### Type consistency

- `Repository` interface is used across all adapters.
- `Dashboard`, `User`, `UserSession`, `Module`, `NewsItem`, `Event`, `Reminder` types are defined once in `src/types/index.ts` and reused.
- `createRepository(adapter: string)` maps env values to adapter instances.
