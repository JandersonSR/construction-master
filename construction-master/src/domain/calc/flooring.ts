import { assertNonNegativeNumber, assertPositiveNumber } from '../validation';

export const DEFAULT_WASTE_PERCENT_FLOORING = 10;

export interface FlooringEstimate {
  netAreaM2: number;
  grossAreaM2: number;
  boxes: number;
  roundedUp: true;
  mortarKg: number;
  groutKg: number;
  wastePercent: number;
}

/**
 * Estima caixas de piso/revestimento, argamassa e rejunte para uma área.
 * Estimada. Único ponto do motor de cálculo onde arredondamos um valor
 * intermediário (para cima) — porque caixas só se compram inteiras. Isso é
 * sinalizado explicitamente via `roundedUp: true` no resultado.
 */
export function calculateFlooringMaterials(
  netAreaM2: number,
  boxCoverageM2: number,
  mortarKgPerM2: number,
  groutKgPerM2: number,
  wastePercent: number = DEFAULT_WASTE_PERCENT_FLOORING,
): FlooringEstimate {
  assertPositiveNumber(netAreaM2, 'netAreaM2');
  assertPositiveNumber(boxCoverageM2, 'boxCoverageM2');
  assertNonNegativeNumber(mortarKgPerM2, 'mortarKgPerM2');
  assertNonNegativeNumber(groutKgPerM2, 'groutKgPerM2');
  assertNonNegativeNumber(wastePercent, 'wastePercent');

  const grossAreaM2 = netAreaM2 * (1 + wastePercent / 100);
  const boxes = Math.ceil(grossAreaM2 / boxCoverageM2);
  const mortarKg = netAreaM2 * mortarKgPerM2;
  const groutKg = netAreaM2 * groutKgPerM2;

  return {
    netAreaM2,
    grossAreaM2,
    boxes,
    roundedUp: true,
    mortarKg,
    groutKg,
    wastePercent,
  };
}
