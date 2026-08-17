import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const items = [
  { to: '/', key: 'home', icon: '🏠' },
  { to: '/project', key: 'myProject', icon: '🏗️' },
  { to: '/calculators', key: 'calculators', icon: '🧮' },
  { to: '/materials', key: 'materials', icon: '🧱' },
  { to: '/more', key: 'more', icon: '⋯' },
] as const;

/** Navegação inferior — visível apenas em telas pequenas (mobile-first). */
export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('nav.home')}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white/95 pb-safe-b backdrop-blur
        dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span aria-hidden="true" className="text-xl">
            {item.icon}
          </span>
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
