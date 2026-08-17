import { assertPositiveNumber, assertInRange } from '../validation';

export const DEFAULT_PEAK_SUN_HOURS = 4.5; // HSP média conservadora no Brasil — sempre editável
export const DEFAULT_PERFORMANCE_RATIO = 0.75; // perdas típicas do sistema (cabos, inversor, temperatura)

export interface SolarEstimate {
  dailyConsumptionKwh: number;
  systemSizeKwp: number;
  panelsCount: number;
  requiredAreaM2: number;
  estimatedMonthlyGenerationKwh: number;
  paybackMonths: number | null;
}

/**
 * Estima dimensionamento aproximado de um sistema fotovoltaico a partir do
 * consumo mensal. Estimada e fortemente dependente de parâmetros regionais
 * (HSP) informados pelo usuário — não substitui projeto elétrico/estudo de
 * viabilidade de instalador credenciado (SafetyNotice obrigatório).
 */
export function calculateSolarSystem(
  monthlyConsumptionKwh: number,
  panelWattage: number,
  panelAreaM2: number,
  systemCostBRL: number,
  monthlySavingsBRL: number,
  peakSunHours: number = DEFAULT_PEAK_SUN_HOURS,
  performanceRatio: number = DEFAULT_PERFORMANCE_RATIO,
): SolarEstimate {
  assertPositiveNumber(monthlyConsumptionKwh, 'monthlyConsumptionKwh');
  assertPositiveNumber(panelWattage, 'panelWattage');
  assertPositiveNumber(panelAreaM2, 'panelAreaM2');
  assertPositiveNumber(systemCostBRL, 'systemCostBRL');
  assertPositiveNumber(peakSunHours, 'peakSunHours');
  assertInRange(performanceRatio, 0.1, 1, 'performanceRatio');

  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;
  const systemSizeKwp = dailyConsumptionKwh / (peakSunHours * performanceRatio);
  const panelsCount = Math.ceil((systemSizeKwp * 1000) / panelWattage);
  const requiredAreaM2 = panelsCount * panelAreaM2;
  const estimatedMonthlyGenerationKwh =
    systemSizeKwp * peakSunHours * performanceRatio * 30;
  const paybackMonths = monthlySavingsBRL > 0 ? systemCostBRL / monthlySavingsBRL : null;

  return {
    dailyConsumptionKwh,
    systemSizeKwp,
    panelsCount,
    requiredAreaM2,
    estimatedMonthlyGenerationKwh,
    paybackMonths,
  };
}
