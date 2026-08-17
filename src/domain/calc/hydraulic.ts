import { assertPositiveInteger, assertPositiveNumber } from '../validation';

export interface HydraulicEstimate {
  pipeMetersEstimate: number;
  connectionsEstimate: number;
}

const DEFAULT_METERS_PER_POINT = 3; // média de tubulação até o ponto mais próximo do prumada — estimativa grosseira
const DEFAULT_CONNECTIONS_PER_POINT = 4;

/**
 * Estimativa grosseira de metragem de tubo e conexões a partir do número de
 * pontos hidráulicos (torneiras, chuveiros, vasos etc.). Não substitui
 * projeto hidráulico (traçado real, diâmetros, perda de carga).
 */
export function calculateHydraulicRoughEstimate(
  points: number,
  metersPerPoint: number = DEFAULT_METERS_PER_POINT,
  connectionsPerPoint: number = DEFAULT_CONNECTIONS_PER_POINT,
): HydraulicEstimate {
  assertPositiveInteger(points, 'points');
  assertPositiveNumber(metersPerPoint, 'metersPerPoint');
  assertPositiveNumber(connectionsPerPoint, 'connectionsPerPoint');

  return {
    pipeMetersEstimate: points * metersPerPoint,
    connectionsEstimate: points * connectionsPerPoint,
  };
}
