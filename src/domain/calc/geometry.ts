import {
  assertNonNegativeNumber,
  assertPositiveNumber,
  CalculationInputError,
} from '../validation';

/** área = comprimento × largura. Exata. Unidades: m → m². */
export function calculateArea(length: number, width: number): number {
  assertPositiveNumber(length, 'length');
  assertPositiveNumber(width, 'width');
  return length * width;
}

/** perímetro de um retângulo = 2 × (comprimento + largura). Exata. */
export function calculateRectanglePerimeter(length: number, width: number): number {
  assertPositiveNumber(length, 'length');
  assertPositiveNumber(width, 'width');
  return 2 * (length + width);
}

/**
 * Área de parede a partir do perímetro e do pé-direito, descontando vãos
 * (portas/janelas). Exata, dado o perímetro e a área de vãos informados.
 */
export function calculateWallArea(
  perimeter: number,
  height: number,
  openingsArea = 0,
): number {
  assertPositiveNumber(perimeter, 'perimeter');
  assertPositiveNumber(height, 'height');
  assertNonNegativeNumber(openingsArea, 'openingsArea');
  const gross = perimeter * height;
  const net = gross - openingsArea;
  if (net < 0) {
    throw new CalculationInputError(
      'openingsArea',
      'errors.openingsExceedWallArea',
      'openingsArea maior que a área bruta da parede',
    );
  }
  return net;
}

/** volume = comprimento × largura × altura. Exata. Unidades: m → m³. */
export function calculateVolume(length: number, width: number, height: number): number {
  assertPositiveNumber(length, 'length');
  assertPositiveNumber(width, 'width');
  assertPositiveNumber(height, 'height');
  return length * width * height;
}

/** área total de piso de uma lista de cômodos. Exata. */
export function calculateTotalFloorArea(roomAreas: number[]): number {
  return roomAreas.reduce((sum, area) => {
    assertPositiveNumber(area, 'roomArea');
    return sum + area;
  }, 0);
}
