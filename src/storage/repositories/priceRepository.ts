import type { PriceOverride } from '../../domain/types';
import { db } from '../db';

export interface PriceRepository {
  listOverrides(): Promise<PriceOverride[]>;
  setOverride(override: PriceOverride): Promise<void>;
  removeOverride(materialId: string): Promise<void>;
  getOverridesMap(): Promise<Record<string, number>>;
}

export class DexiePriceRepository implements PriceRepository {
  async listOverrides(): Promise<PriceOverride[]> {
    return db.priceOverrides.toArray();
  }

  async setOverride(override: PriceOverride): Promise<void> {
    await db.priceOverrides.put(override);
  }

  async removeOverride(materialId: string): Promise<void> {
    await db.priceOverrides.delete(materialId);
  }

  async getOverridesMap(): Promise<Record<string, number>> {
    const overrides = await this.listOverrides();
    return Object.fromEntries(overrides.map((o) => [o.materialId, o.price]));
  }
}

export const priceRepository: PriceRepository = new DexiePriceRepository();
