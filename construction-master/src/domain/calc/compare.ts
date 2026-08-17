import { assertPositiveNumber } from '../validation';
import type { MethodComparisonResult } from '../types/budget';
import type { ConstructionMethod } from '../types/method';

/**
 * Custo total estimado de um método construtivo para uma área, a partir de
 * um custo base de referência por m² multiplicado pelo fator relativo do
 * método. Estimada — serve para comparação relativa entre métodos, não como
 * orçamento fechado (o orçamento fechado vem de `calculateProjectBudget`,
 * que soma etapa a etapa com preços reais do catálogo).
 */
export function calculateMethodCost(
  method: ConstructionMethod,
  baseCostPerM2: number,
  areaM2: number,
): number {
  assertPositiveNumber(baseCostPerM2, 'baseCostPerM2');
  assertPositiveNumber(areaM2, 'areaM2');
  assertPositiveNumber(method.relativeCostFactor, 'method.relativeCostFactor');
  return baseCostPerM2 * method.relativeCostFactor * areaM2;
}

/** Compara o custo total estimado de dois métodos construtivos para a mesma área. */
export function compareConstructionMethods(
  methodA: ConstructionMethod,
  methodB: ConstructionMethod,
  baseCostPerM2: number,
  areaM2: number,
): MethodComparisonResult {
  const totalA = calculateMethodCost(methodA, baseCostPerM2, areaM2);
  const totalB = calculateMethodCost(methodB, baseCostPerM2, areaM2);
  const diffAbs = totalB - totalA;
  const diffPercent = totalA > 0 ? (diffAbs / totalA) * 100 : 0;

  return {
    methodAId: methodA.id,
    methodBId: methodB.id,
    totalA,
    totalB,
    diffAbs,
    diffPercent,
  };
}
