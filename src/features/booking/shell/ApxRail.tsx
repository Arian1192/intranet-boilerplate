import { Fragment } from 'react';
import { Link, useLocation } from 'react-router';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApxShell } from './ApxShell';
import { RAIL_FOOT, RAIL_GROUPS, esItemActivo } from './nav';
import type { User } from '@/types';

/** Mismo contador que la campana del TopNav compartido. */
const NOTIFICACIONES = 12;

/**
 * El rail de ConceptOne: 58 px que se expanden a 224 px al hover, con el logo,
 * el CTA, los tres grupos y el pie de seis elementos.
 *
 * Los ítems **no llevan `title` ni `aria-label`**: el live no los tiene y con el
 * rail plegado el único indicio es el icono. Verificado en la captura del
 * 2026-09-09; no se «mejora» aquí.
 */
export function ApxRail({ user }: { user: User }) {
  const { pathname } = useLocation();
  const { alternarTema, abrirAyuda } = useApxShell();

  return (
    <nav className="apx-side">
      <div className="apx-side-logo">
        <Link to="/conceptone">
          <img src="/logo_antlers.svg" alt="" />
          <span className="brandtxt">ConceptOne</span>
        </Link>
      </div>

      <button type="button" className="apx-cta">
        <Plus />
        <span className="apx-nav-lab">Añadir show</span>
      </button>

      <div className="apx-side-scroll">
        {RAIL_GROUPS.map((grupo) => (
          <Fragment key={grupo.caption}>
            <div className="apx-nav-cap">{grupo.caption}</div>
            {grupo.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                // El activo NO lleva pastilla de fondo: `.on` sólo cambia color y
                // peso (`background: none` en apx.css).
                className={cn('apx-nav-item', esItemActivo(pathname, item.href) && 'on')}
                aria-current={esItemActivo(pathname, item.href) ? 'page' : undefined}
              >
                <item.icon />
                <span className="apx-nav-lab">{item.label}</span>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="apx-side-foot">
        {RAIL_FOOT.map((item) => {
          if (item.kind === 'link') {
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn('apx-nav-item', esItemActivo(pathname, item.href) && 'on')}
                aria-current={esItemActivo(pathname, item.href) ? 'page' : undefined}
              >
                <item.icon />
                <span className="apx-nav-lab">{item.label}</span>
              </Link>
            );
          }

          if (item.kind === 'action') {
            return (
              <button
                key={item.action}
                type="button"
                className="apx-nav-item"
                onClick={item.action === 'tema' ? alternarTema : abrirAyuda}
              >
                <item.icon />
                <span className="apx-nav-lab">{item.label}</span>
              </button>
            );
          }

          if (item.kind === 'notificaciones') {
            // Un `div` inerte que envuelve el botón de campana: quien pulsa es el
            // botón, no la fila, de ahí el `cursor: default`.
            return (
              <div key={item.kind} className="apx-nav-item" style={{ cursor: 'default' }}>
                <div className="relative">
                  <button
                    type="button"
                    className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Notificaciones"
                  >
                    <item.icon size={18} strokeWidth={1.8} />
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {NOTIFICACIONES > 9 ? '9+' : NOTIFICACIONES}
                    </span>
                  </button>
                </div>
                <span className="apx-nav-lab">{item.label}</span>
              </div>
            );
          }

          return (
            <Link key={item.href} to={item.href} className="apx-prof">
              <span
                className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
                aria-label={user.name}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'rgb(79, 70, 229)',
                  fontSize: 13,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="txt">
                <span className="nm">{user.name}</span>
                <span className="rl">{user.role}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
