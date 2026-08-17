import type { Project, PriceOverride } from '../domain/types';
import { db } from './db';

export const BACKUP_FORMAT_VERSION = 1;

export interface BackupPayload {
  version: number;
  exportedAt: string;
  data: {
    projects: Project[];
    priceOverrides: PriceOverride[];
    settings: Record<string, unknown>;
  };
}

/** Exporta todos os dados locais (obras, preços, configurações) para um objeto serializável em JSON. */
export async function exportBackup(): Promise<BackupPayload> {
  const [projects, priceOverrides, settingsRows] = await Promise.all([
    db.projects.toArray(),
    db.priceOverrides.toArray(),
    db.settings.toArray(),
  ]);

  return {
    version: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      projects,
      priceOverrides,
      settings: Object.fromEntries(settingsRows.map((r) => [r.key, r.value])),
    },
  };
}

export class BackupImportError extends Error {}

/**
 * Importa um backup previamente exportado. Substitui os dados locais pelos
 * do backup (o usuário é avisado na UI antes de confirmar, é uma operação
 * destrutiva sobre o estado atual).
 */
export async function importBackup(payload: unknown): Promise<void> {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('version' in payload) ||
    !('data' in payload)
  ) {
    throw new BackupImportError('Arquivo de backup inválido.');
  }

  const backup = payload as BackupPayload;
  if (backup.version !== BACKUP_FORMAT_VERSION) {
    throw new BackupImportError(
      `Versão de backup incompatível (esperado ${BACKUP_FORMAT_VERSION}, recebido ${backup.version}).`,
    );
  }

  await db.transaction('rw', db.projects, db.priceOverrides, db.settings, async () => {
    await db.projects.clear();
    await db.priceOverrides.clear();
    await db.settings.clear();

    await db.projects.bulkPut(backup.data.projects ?? []);
    await db.priceOverrides.bulkPut(backup.data.priceOverrides ?? []);
    await db.settings.bulkPut(
      Object.entries(backup.data.settings ?? {}).map(([key, value]) => ({ key, value })),
    );
  });
}

/** Gera um arquivo .json para download a partir do backup atual (usado pelo botão "Exportar"). */
export function backupToBlob(backup: BackupPayload): Blob {
  return new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
}
