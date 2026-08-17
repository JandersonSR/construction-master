import { assertNonNegativeNumber, assertPositiveNumber } from '../validation';

export interface BlockDefinition {
  id: string;
  nameKey: string;
  /** área que 1 unidade cobre na parede, já considerando junta (m²) */
  coverageAreaM2: number;
  /** consumo de argamassa de assentamento por m² de parede (m³) */
  mortarM3PerM2: number;
}

export const DEFAULT_WASTE_PERCENT_MASONRY = 10;

export interface MasonryEstimate {
  wallAreaM2: number;
  units: number;
  mortarM3: number;
  wastePercent: number;
}

/**
 * Estima quantidade de blocos/tijolos e argamassa de assentamento para uma
 * área de parede. Estimada — os fatores de cobertura vêm de
 * `BlockDefinition` (catálogo, sobrescrevível).
 */
export function calculateMasonryMaterials(
  wallAreaM2: number,
  block: BlockDefinition,
  wastePercent: number = DEFAULT_WASTE_PERCENT_MASONRY,
): MasonryEstimate {
  assertPositiveNumber(wallAreaM2, 'wallAreaM2');
  assertPositiveNumber(block.coverageAreaM2, 'block.coverageAreaM2');
  assertNonNegativeNumber(wastePercent, 'wastePercent');

  const netUnits = wallAreaM2 / block.coverageAreaM2;
  const units = netUnits * (1 + wastePercent / 100);
  const mortarM3 = wallAreaM2 * block.mortarM3PerM2;

  return { wallAreaM2, units, mortarM3, wastePercent };
}
