import { assertNonNegativeNumber, assertPositiveNumber } from '../validation';
import type { BudgetSummary, StageBudgetLine } from '../types/budget';

export const DEFAULT_CONTINGENCY_PERCENT = 10;

export interface StageCostInput {
  stageDefId: string;
  materialsCost: number;
  laborCost: number;
}

/** custo total de uma etapa = materiais + mão de obra. Exata. */
export function calculateStageTotal(materialsCost: number, laborCost: number): number {
  assertNonNegativeNumber(materialsCost, 'materialsCost');
  assertNonNegativeNumber(laborCost, 'laborCost');
  return materialsCost + laborCost;
}

export interface ProjectBudgetInput {
  stages: StageCostInput[];
  toolsCost?: number;
  otherCost?: number;
  contingencyPercent?: number;
  areaM2: number;
}

/**
 * Consolida o orçamento total da obra. Exata, dado os custos por etapa já
 * calculados (materiais via catálogo de preços, mão de obra via
 * `calculateStageLaborCost`).
 */
export function calculateProjectBudget(input: ProjectBudgetInput): BudgetSummary {
  const {
    stages,
    toolsCost = 0,
    otherCost = 0,
    contingencyPercent = DEFAULT_CONTINGENCY_PERCENT,
    areaM2,
  } = input;

  assertNonNegativeNumber(toolsCost, 'toolsCost');
  assertNonNegativeNumber(otherCost, 'otherCost');
  assertNonNegativeNumber(contingencyPercent, 'contingencyPercent');
  assertPositiveNumber(areaM2, 'areaM2');

  const byStage: StageBudgetLine[] = stages.map((s) => ({
    stageDefId: s.stageDefId,
    materials: s.materialsCost,
    labor: s.laborCost,
    total: calculateStageTotal(s.materialsCost, s.laborCost),
  }));

  const materialsCost = byStage.reduce((sum, s) => sum + s.materials, 0);
  const laborCost = byStage.reduce((sum, s) => sum + s.labor, 0);
  const subtotal = materialsCost + laborCost + toolsCost + otherCost;
  const contingency = subtotal * (contingencyPercent / 100);
  const total = subtotal + contingency;

  return {
    materialsCost,
    laborCost,
    toolsCost,
    otherCost,
    contingency,
    total,
    costPerSquareMeter: total / areaM2,
    byStage,
  };
}

/** custo/m² = custo total / área. Exata. */
export function calculateCostPerSquareMeter(total: number, areaM2: number): number {
  assertNonNegativeNumber(total, 'total');
  assertPositiveNumber(areaM2, 'areaM2');
  return total / areaM2;
}

export interface DiySimulationResult {
  professionalCost: number;
  diyCost: number;
  savings: number;
  savingsPercent: number;
}

/** Simulador "faça você mesmo": compara custo profissional x DIY para uma etapa/conjunto. */
export function simulateDiySavings(
  professionalCost: number,
  diyCost: number,
): DiySimulationResult {
  assertNonNegativeNumber(professionalCost, 'professionalCost');
  assertNonNegativeNumber(diyCost, 'diyCost');
  const savings = professionalCost - diyCost;
  const savingsPercent = professionalCost > 0 ? (savings / professionalCost) * 100 : 0;
  return { professionalCost, diyCost, savings, savingsPercent };
}
