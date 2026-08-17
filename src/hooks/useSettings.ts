import { useEffect, useState, useCallback } from 'react';
import {
  settingsRepository,
  DEFAULT_SETTINGS,
  type AppSettings,
} from '../storage/repositories/settingsRepository';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    settingsRepository.get().then((s) => {
      if (!mounted) return;
      setSettings(s);
      setLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const update = useCallback(async (patch: Partial<AppSettings>) => {
    const next = await settingsRepository.set(patch);
    setSettings(next);
    return next;
  }, []);

  return { settings, loaded, update };
}
