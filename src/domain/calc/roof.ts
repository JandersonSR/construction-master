import {
  assertInRange,
  assertNonNegativeNumber,
  assertPositiveNumber,
} from '../validation';

export const DEFAULT_WASTE_PERCENT_ROOF = 10;

export interface RoofEstimate {
  footprintAreaM2: number;
  pitchDegrees: number;
  roofAreaM2: number;
  tiles: number;
  wastePercent: number;
}

/**
 * Estima área real do telhado (considerando inclinação) e quantidade de
 * telhas. Estimada — não dimensiona estrutura/carga de vento (SafetyNotice
 * obrigatório na UI). `pitchDegrees = 0` → telhado plano.
 */
export function calculateRoofMaterials(
  footprintAreaM2: number,
  pitchDegrees: number,
  tileCoverageM2: number,
  wastePercent: number = DEFAULT_WASTE_PERCENT_ROOF,
): RoofEstimate {
  assertPositiveNumber(footprintAreaM2, 'footprintAreaM2');
  assertInRange(pitchDegrees, 0, 89, 'pitchDegrees');
  assertPositiveNumber(tileCoverageM2, 'tileCoverageM2');
  assertNonNegativeNumber(wastePercent, 'wastePercent');

  const roofAreaM2 = footprintAreaM2 / Math.cos((pitchDegrees * Math.PI) / 180);
  const tiles = Math.ceil((roofAreaM2 * (1 + wastePercent / 100)) / tileCoverageM2);

  return { footprintAreaM2, pitchDegrees, roofAreaM2, tiles, wastePercent };
}
