import { describe, it, expect } from 'vitest';
import {
  calculateStageTotal,
  calculateProjectBudget,
  calculateCostPerSquareMeter,
  simulateDiySavings,
} from './budget';

describe('budget', () => {
  it('custo de etapa = materiais + mão de obra', () => {
    expect(calculateStageTotal(1000, 500)).toBe(1500);
  });

  it('consolida orçamento do projeto com contingência default 10%', () => {
    const summary = calculateProjectBudget({
      stages: [
        { stageDefId: 'foundation', materialsCost: 5000, laborCost: 3000 },
        { stageDefId: 'masonry', materialsCost: 4000, laborCost: 2000 },
      ],
      areaM2: 100,
    });
    expect(summary.materialsCost).toBe(9000);
    expect(summary.laborCost).toBe(5000);
    const subtotal = 9000 + 5000; // sem tools/other
    expect(summary.contingency).toBeCloseTo(subtotal * 0.1, 5);
    expect(summary.total).toBeCloseTo(subtotal * 1.1, 5);
    expect(summary.costPerSquareMeter).toBeCloseTo(summary.total / 100, 5);
    expect(summary.byStage).toHaveLength(2);
  });

  it('inclui ferramentas, outros custos e contingência customizada', () => {
    const summary = calculateProjectBudget({
      stages: [{ stageDefId: 'x', materialsCost: 1000, laborCost: 0 }],
      toolsCost: 200,
      otherCost: 100,
      contingencyPercent: 5,
      areaM2: 50,
    });
    const subtotal = 1000 + 200 + 100;
    expect(summary.total).toBeCloseTo(subtotal * 1.05, 5);
  });

  it('custo por m2', () => {
    expect(calculateCostPerSquareMeter(20000, 100)).toBe(200);
  });

  it('simulador DIY calcula economia absoluta e percentual', () => {
    const result = simulateDiySavings(8000, 3000);
    expect(result.savings).toBe(5000);
    expect(result.savingsPercent).toBeCloseTo(62.5, 5);
  });
});
