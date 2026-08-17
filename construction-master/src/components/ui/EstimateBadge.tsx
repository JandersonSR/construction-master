import { useTranslation } from 'react-i18next';

/** Selo "Estimativa" — usado em todo resultado de cálculo que depende de uma premissa. */
export function EstimateBadge() {
  const { t } = useTranslation();
  return (
    <span className="badge bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">
      {t('common.estimateBadge')}
    </span>
  );
}
