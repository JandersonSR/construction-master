import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const items = [
  { to: '/budget', key: 'budget', icon: '💰' },
  { to: '/guide', key: 'guide', icon: '📘' },
  { to: '/videos', key: 'videos', icon: '🎬' },
  { to: '/compare-methods', key: 'compareMethods', icon: '⚖️' },
  { to: '/progress', key: 'progress', icon: '📈' },
  { to: '/settings', key: 'settings', icon: '⚙️' },
] as const;

/** Menu "Mais" — só é visível/necessário no mobile (bottom nav tem só 5 slots). */
export default function MorePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('nav.more')}
      </h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="card flex items-center gap-3 hover:shadow-md">
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {t(`nav.${item.key}`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
