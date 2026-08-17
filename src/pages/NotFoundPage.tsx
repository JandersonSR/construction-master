import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">
        🧭
      </span>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">404</h1>
      <Link to="/" className="btn-primary">
        {t('nav.home')}
      </Link>
    </div>
  );
}
