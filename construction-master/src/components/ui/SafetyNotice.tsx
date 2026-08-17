import { useTranslation } from 'react-i18next';
import type { SafetyLevel } from '../../domain/types';

interface SafetyNoticeProps {
  level: SafetyLevel;
}

/**
 * Aviso de segurança padrão, exibido em qualquer tela que toque em
 * fundação, estrutura, elétrica, piscina/spa, telhado ou energia solar.
 * Nunca afirma que algo é seguro — apenas indica o nível de necessidade de
 * avaliação profissional.
 */
export function SafetyNotice({ level }: SafetyNoticeProps) {
  const { t } = useTranslation();

  if (level === 'none') return null;

  const isRequired = level === 'required';

  return (
    <div
      role="note"
      className={
        'flex gap-3 rounded-xl border p-4 text-sm ' +
        (isRequired
          ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
          : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200')
      }
    >
      <span aria-hidden="true" className="text-lg leading-none">
        {isRequired ? '⚠️' : 'ℹ️'}
      </span>
      <div>
        <p className="font-semibold">{t('common.safetyNotice.title')}</p>
        <p>
          {isRequired
            ? t('common.safetyNotice.required')
            : t('common.safetyNotice.recommended')}
        </p>
      </div>
    </div>
  );
}
