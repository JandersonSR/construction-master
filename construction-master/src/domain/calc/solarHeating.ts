import { assertPositiveNumber } from '../validation';

export interface SolarHeatingEstimate {
  reservoirLiters: number;
  collectorsCount: number;
  collectorAreaM2: number;
}

const DEFAULT_LITERS_PER_PERSON = 60; // referência usual de dimensionamento residencial

/**
 * Estima número de coletores e volume do boiler para aquecimento solar de
 * água. Estimada — dimensionamento final depende de instalador
 * credenciado, orientação do telhado e clima local (SafetyNotice).
 */
export function calculateSolarHeatingSystem(
  occupants: number,
  collectorAreaM2PerUnit: number,
  litersPerPerson: number = DEFAULT_LITERS_PER_PERSON,
): SolarHeatingEstimate {
  assertPositiveNumber(occupants, 'occupants');
  assertPositiveNumber(collectorAreaM2PerUnit, 'collectorAreaM2PerUnit');
  assertPositiveNumber(litersPerPerson, 'litersPerPerson');

  const reservoirLiters = occupants * litersPerPerson;
  // referência de mercado: ~1 m² de coletor para cada 75L de reservatório
  const collectorsCount = Math.ceil(reservoirLiters / 75 / collectorAreaM2PerUnit) || 1;
  const collectorAreaM2 = collectorsCount * collectorAreaM2PerUnit;

  return { reservoirLiters, collectorsCount, collectorAreaM2 };
}
