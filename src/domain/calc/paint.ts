import { assertPositiveInteger, assertPositiveNumber } from '../validation';

export const DEFAULT_PAINT_COATS = 2;

export interface PaintEstimate {
  paintableAreaM2: number;
  coats: number;
  liters: number;
  yieldM2PerLiter: number;
}

/**
 * Estima litros de tinta necessários. Estimada — `yieldM2PerLiter`
 * (rendimento) é informado pelo tipo de tinta escolhido (catálogo,
 * sobrescrevível) e deve ser conferido na embalagem real.
 */
export function calculatePaintLiters(
  paintableAreaM2: number,
  yieldM2PerLiter: number,
  coats: number = DEFAULT_PAINT_COATS,
): PaintEstimate {
  assertPositiveNumber(paintableAreaM2, 'paintableAreaM2');
  assertPositiveNumber(yieldM2PerLiter, 'yieldM2PerLiter');
  assertPositiveInteger(coats, 'coats');

  const liters = (paintableAreaM2 * coats) / yieldM2PerLiter;
  return { paintableAreaM2, coats, liters, yieldM2PerLiter };
}
