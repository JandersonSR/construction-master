import { useCallback, useEffect, useState } from 'react';
import {
  settingsRepository,
  type AppSettings,
} from '../storage/repositories/settingsRepository';

function applyThemeClass(theme: AppSettings['theme']) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

/** Hook de tema claro/escuro/automático, persistido em `settingsRepository`. */
export function useTheme() {
  const [theme, setThemeState] = useState<AppSettings['theme']>('system');

  useEffect(() => {
    let mounted = true;
    settingsRepository.get().then((settings) => {
      if (!mounted) return;
      setThemeState(settings.theme);
      applyThemeClass(settings.theme);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyThemeClass('system');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = useCallback(async (next: AppSettings['theme']) => {
    setThemeState(next);
    applyThemeClass(next);
    await settingsRepository.set({ theme: next });
  }, []);

  return { theme, setTheme };
}
