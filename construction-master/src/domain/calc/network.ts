import { assertPositiveInteger, assertPositiveNumber } from '../validation';

export interface NetworkEstimate {
  cableMetersEstimate: number;
  connectorsEstimate: number;
  patchCordsEstimate: number;
}

const DEFAULT_METERS_PER_POINT = 15; // ponto até o rack, estimativa
const CONNECTORS_PER_CABLE_RUN = 2; // RJ45 nas duas pontas

/** Estimativa de infraestrutura de rede (Ethernet) a partir do número de pontos. */
export function calculateNetworkEstimate(
  points: number,
  metersPerPoint: number = DEFAULT_METERS_PER_POINT,
): NetworkEstimate {
  assertPositiveInteger(points, 'points');
  assertPositiveNumber(metersPerPoint, 'metersPerPoint');

  return {
    cableMetersEstimate: points * metersPerPoint,
    connectorsEstimate: points * CONNECTORS_PER_CABLE_RUN,
    patchCordsEstimate: points,
  };
}
