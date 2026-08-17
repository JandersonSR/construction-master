import Dexie, { type Table } from 'dexie';
import type { Project, PriceOverride } from '../domain/types';

export interface SettingRecord {
  key: string;
  value: unknown;
}

export interface PhotoRecord {
  id: string;
  blob: Blob;
  createdAt: string;
}

/**
 * Banco IndexedDB local (via Dexie). Nenhum componente de UI deve importar
 * este arquivo diretamente — sempre passar pelos repositórios em
 * `src/storage/repositories/*`.
 */
export class ConstructionMasterDB extends Dexie {
  projects!: Table<Project, string>;
  priceOverrides!: Table<PriceOverride, string>;
  settings!: Table<SettingRecord, string>;
  photos!: Table<PhotoRecord, string>;

  constructor() {
    super('construction-master');
    this.version(1).stores({
      projects: 'id, updatedAt, scenarioOf',
      priceOverrides: 'materialId',
      settings: 'key',
      photos: 'id, createdAt',
    });
  }
}

export const db = new ConstructionMasterDB();
