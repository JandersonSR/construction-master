import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const items = [
  { to: '/', key: 'home', icon: '🏠' },
  { to: '/project', key: 'myProject', icon: '🏗️' },
  { to: '/budget', key: 'budget', icon: '💰' },
  { to: '/calculators', key: 'calculators', icon: '🧮' },
  { to: '/materials', key: 'materials', icon: '🧱' },
  { to: '/guide', key: 'guide', icon: '📘' },
  { to: '/videos', key: 'videos', icon: '🎬' },
  { to: '/compare-methods', key: 'compareMethods', icon: '⚖️' },
  { to: '/progress', key: 'progress', icon: '📈' },
  { to: '/settings', key: 'settings', icon: '⚙️' },
] as const;

/** Navegação lateral — visível a partir de telas médias (desktop). */
export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-2xl" aria-hidden="true">
          🏗️
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          {t('common.appName')}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </nav>
      <p className="px-2 text-xs text-slate-400">
        {t('common.footer.openSource')} · {t('common.footer.license')}
      </p>
    </aside>
  );
}
