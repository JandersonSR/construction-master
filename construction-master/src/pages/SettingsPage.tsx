import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { exportBackup, importBackup, backupToBlob } from '../storage/backup';
import { SUPPORTED_LANGUAGES } from '../i18n';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    const backup = await exportBackup();
    const blob = backupToBlob(backup);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `construction-master-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    if (!window.confirm(t('settings.importWarning'))) return;
    try {
      const text = await file.text();
      await importBackup(JSON.parse(text));
      window.alert(t('settings.importSuccess'));
      window.location.reload();
    } catch {
      window.alert(t('errors.importInvalid'));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('settings.title')}
      </h1>

      <section className="card space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t('settings.appearance')}
        </h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((opt) => (
            <button
              key={opt}
              className={theme === opt ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setTheme(opt)}
            >
              {t(`common.theme.${opt}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t('settings.languageAndUnits')}
        </h2>
        <div className="flex gap-2">
          {SUPPORTED_LANGUAGES.map((lng) => (
            <button
              key={lng}
              className={i18n.language === lng ? 'btn-primary' : 'btn-secondary'}
              onClick={() => i18n.changeLanguage(lng)}
            >
              {t(`common.language.${lng}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t('settings.dataAndBackup')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={handleExport}>
            {t('settings.exportBackup')}
          </button>
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
            {t('settings.importBackup')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <section className="card space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t('settings.about.title')}
        </h2>
        <p>{t('settings.about.description')}</p>
        <p>{t('settings.about.license')}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('settings.about.disclaimer')}
        </p>
      </section>
    </div>
  );
}
