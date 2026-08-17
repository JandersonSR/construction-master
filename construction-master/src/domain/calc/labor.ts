import { assertPositiveInteger, assertPositiveNumber } from '../validation';
import type {
  ContractLaborConfig,
  DailyLaborConfig,
  LaborConfig,
  LaborMode,
  MixedLaborAssignment,
} from '../types/labor';

/** custo = profissionais × diária × dias. Exata (dado o input do usuário). */
export function calculateDailyLaborCost(config: DailyLaborConfig): number {
  assertPositiveInteger(config.workers, 'workers');
  assertPositiveNumber(config.dailyRate, 'dailyRate');
  assertPositiveInteger(config.days, 'days');
  return config.workers * config.dailyRate * config.days;
}

/** empreitada: valor fechado informado pelo usuário. */
export function calculateContractLaborCost(config: ContractLaborConfig): number {
  assertPositiveNumber(config.totalValue, 'totalValue');
  return config.totalValue;
}

function calculateAssignmentCost(assignment: MixedLaborAssignment): number {
  if (assignment.mode === 'contract') {
    assertPositiveNumber(assignment.totalValue ?? 0, `mixed.${assignment.id}.totalValue`);
    return assignment.totalValue ?? 0;
  }
  const workers = assertPositiveInteger(
    assignment.workers ?? 0,
    `mixed.${assignment.id}.workers`,
  );
  const dailyRate = assertPositiveNumber(
    assignment.dailyRate ?? 0,
    `mixed.${assignment.id}.dailyRate`,
  );
  const days = assertPositiveInteger(assignment.days ?? 0, `mixed.${assignment.id}.days`);
  return workers * dailyRate * days;
}

/** soma o custo de todas as atribuições de mão de obra mista. */
export function calculateMixedLaborCost(assignments: MixedLaborAssignment[]): number {
  return assignments.reduce((sum, a) => sum + calculateAssignmentCost(a), 0);
}

/**
 * Calcula o custo de mão de obra de uma etapa de acordo com o modo
 * escolhido. DIY = 0 (custo monetário; tempo é um campo separado, não
 * custo).
 */
export function calculateStageLaborCost(mode: LaborMode, config: LaborConfig): number {
  switch (mode) {
    case 'diy':
      return 0;
    case 'daily':
      if (!config.daily) return 0;
      return calculateDailyLaborCost(config.daily);
    case 'contract':
      if (!config.contract) return 0;
      return calculateContractLaborCost(config.contract);
    case 'mixed':
      return calculateMixedLaborCost(config.mixed ?? []);
    default:
      return 0;
  }
}
