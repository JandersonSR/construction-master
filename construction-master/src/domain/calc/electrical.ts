import { assertPositiveInteger, assertPositiveNumber } from '../validation';

export interface ElectricalEstimate {
  outletsEstimate: number;
  switchesEstimate: number;
  cableMetersEstimate: number;
  circuitsEstimate: number;
}

const DEFAULT_OUTLETS_PER_ROOM = 4;
const DEFAULT_CABLE_METERS_PER_POINT = 5;
const DEFAULT_POINTS_PER_CIRCUIT = 6;

/**
 * Estimativa grosseira de tomadas/interruptores/cabos/circuitos a partir do
 * número de cômodos. NÃO é dimensionamento elétrico normativo — apenas uma
 * lista de compras orientativa. Todo projeto elétrico final deve ser
 * validado por eletricista/profissional habilitado (SafetyNotice
 * "required").
 */
export function calculateElectricalRoughEstimate(
  rooms: number,
  outletsPerRoom: number = DEFAULT_OUTLETS_PER_ROOM,
): ElectricalEstimate {
  assertPositiveInteger(rooms, 'rooms');
  assertPositiveNumber(outletsPerRoom, 'outletsPerRoom');

  const outletsEstimate = rooms * outletsPerRoom;
  const switchesEstimate = rooms; // 1 ponto de comando por cômodo, estimativa mínima
  const totalPoints = outletsEstimate + switchesEstimate;
  const cableMetersEstimate = totalPoints * DEFAULT_CABLE_METERS_PER_POINT;
  const circuitsEstimate = Math.ceil(totalPoints / DEFAULT_POINTS_PER_CIRCUIT);

  return { outletsEstimate, switchesEstimate, cableMetersEstimate, circuitsEstimate };
}
