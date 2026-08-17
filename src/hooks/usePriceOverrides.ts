import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { priceRepository } from '../storage/repositories/priceRepository';
import { resolveMaterialPrice } from '../domain/pricing/catalog';

/** Mapa reativo materialId -> preço, já com overrides globais do usuário aplicados. */
export function usePriceOverridesMap(): Record<string, number> {
  const overrides = useLiveQuery(() => db.priceOverrides.toArray(), []);
  const map: Record<string, number> = {};
  for (const o of overrides ?? []) {
    map[o.materialId] = o.price;
  }
  return map;
}

export function resolvePrice(
  materialId: string,
  overrides: Record<string, number>,
): number {
  return resolveMaterialPrice(materialId, overrides);
}

export const setPriceOverride = priceRepository.setOverride.bind(priceRepository);
export const removePriceOverride = priceRepository.removeOverride.bind(priceRepository);
