import { db } from '../db';

export interface AppSettings {
  language: 'pt-BR' | 'en' | 'es';
  theme: 'light' | 'dark' | 'system';
  activeProjectId?: string;
  onboardingSeeded: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'pt-BR',
  theme: 'system',
  onboardingSeeded: false,
};

export interface SettingsRepository {
  get(): Promise<AppSettings>;
  set(patch: Partial<AppSettings>): Promise<AppSettings>;
}

export class DexieSettingsRepository implements SettingsRepository {
  async get(): Promise<AppSettings> {
    const rows = await db.settings.toArray();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULT_SETTINGS, ...stored } as AppSettings;
  }

  async set(patch: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const next = { ...current, ...patch };
    await db.settings.bulkPut(
      Object.entries(patch).map(([key, value]) => ({ key, value })),
    );
    return next;
  }
}

export const settingsRepository: SettingsRepository = new DexieSettingsRepository();
