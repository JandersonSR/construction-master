import type { BudgetSummary, Project, ProjectStage } from '../domain/types';
import { calculateProjectBudget, calculateStageLaborCost } from '../domain/calc';
import { resolveMaterialPrice } from '../domain/pricing/catalog';

export interface ProjectBudgetOptions {
  toolsCost?: number;
  otherCost?: number;
  contingencyPercent?: number;
}

/** Custo de materiais de uma etapa, aplicando overrides (por linha, depois globais/da obra). */
export function stageMaterialsCost(
  stage: ProjectStage,
  priceOverrides: Record<string, number>,
): number {
  return stage.materials.reduce((sum, line) => {
    const price =
      line.unitPriceOverride ?? resolveMaterialPrice(line.materialId, priceOverrides);
    return sum + price * line.quantity;
  }, 0);
}

/** Custo de mão de obra de uma etapa — nunca lança para a UI, cai para 0 em configuração incompleta. */
export function stageLaborCostSafe(stage: ProjectStage): number {
  try {
    return calculateStageLaborCost(stage.laborMode, stage.laborConfig);
  } catch {
    return 0;
  }
}

/**
 * Calcula o orçamento consolidado de uma obra, combinando:
 * - custo de materiais por etapa (catálogo de preços + overrides globais e da obra);
 * - custo de mão de obra por etapa (conforme o modo escolhido);
 * - ferramentas, outros custos e contingência (opcionais, com defaults do motor de cálculo).
 */
export function computeProjectBudget(
  project: Project,
  globalPriceOverrides: Record<string, number>,
  options: ProjectBudgetOptions = {},
): BudgetSummary {
  const mergedOverrides = { ...globalPriceOverrides, ...project.priceOverrides };

  const stagesCost = project.stages.map((stage) => ({
    stageDefId: stage.stageDefId,
    materialsCost: stageMaterialsCost(stage, mergedOverrides),
    laborCost: stageLaborCostSafe(stage),
  }));

  const area =
    project.dimensions.area && project.dimensions.area > 0 ? project.dimensions.area : 1;

  return calculateProjectBudget({
    stages: stagesCost,
    toolsCost: options.toolsCost ?? 0,
    otherCost: options.otherCost ?? 0,
    contingencyPercent: options.contingencyPercent,
    areaM2: area,
  });
}

export function computeActualCost(project: Project): number {
  return project.stages.reduce((sum, s) => sum + (s.actualCost ?? 0), 0);
}
