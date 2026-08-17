import { assertNonNegativeNumber, assertPositiveNumber } from '../validation';
import { calculateArea } from './geometry';

export const DEFAULT_WASTE_PERCENT_DECK = 10;
export const DEFAULT_SCREWS_PER_BOARD = 12;

export interface DeckEstimate {
  deckAreaM2: number;
  boards: number;
  joists: number;
  screws: number;
  wastePercent: number;
}

/**
 * Estima tábuas, vigotas (joists) e parafusos para um deck retangular.
 * Estimada — puramente geométrica a partir de dimensões informadas pelo
 * usuário; não avalia carga (ver `calculatePoolLoadEstimate` para o caso de
 * piscina sobre deck, que exige projeto profissional).
 */
export function calculateDeckMaterials(
  length: number,
  width: number,
  boardCoverageM2: number,
  joistSpacingM: number,
  wastePercent: number = DEFAULT_WASTE_PERCENT_DECK,
  screwsPerBoard: number = DEFAULT_SCREWS_PER_BOARD,
): DeckEstimate {
  const deckAreaM2 = calculateArea(length, width);
  assertPositiveNumber(boardCoverageM2, 'boardCoverageM2');
  assertPositiveNumber(joistSpacingM, 'joistSpacingM');
  assertNonNegativeNumber(wastePercent, 'wastePercent');
  assertPositiveNumber(screwsPerBoard, 'screwsPerBoard');

  const boards = Math.ceil((deckAreaM2 / boardCoverageM2) * (1 + wastePercent / 100));
  const joists = Math.ceil(length / joistSpacingM) + 1;
  const screws = boards * screwsPerBoard;

  return { deckAreaM2, boards, joists, screws, wastePercent };
}

export interface PoolLoadEstimate {
  volumeM3: number;
  waterWeightKg: number;
  structureWeightKg: number;
  totalLoadKg: number;
}

const WATER_KG_PER_M3 = 1000;

/**
 * Estima o peso aproximado (água + estrutura informada) de uma piscina
 * sobre deck. NUNCA declara a estrutura segura — apenas soma pesos a partir
 * de dados informados pelo usuário. Verificação estrutural profissional é
 * sempre obrigatória (SafetyNotice nível "required").
 */
export function calculatePoolLoadEstimate(
  volumeM3: number,
  structureWeightKg: number,
): PoolLoadEstimate {
  assertPositiveNumber(volumeM3, 'volumeM3');
  assertNonNegativeNumber(structureWeightKg, 'structureWeightKg');

  const waterWeightKg = volumeM3 * WATER_KG_PER_M3;
  return {
    volumeM3,
    waterWeightKg,
    structureWeightKg,
    totalLoadKg: waterWeightKg + structureWeightKg,
  };
}
