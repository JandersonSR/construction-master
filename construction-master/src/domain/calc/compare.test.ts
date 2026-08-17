import { describe, it, expect } from 'vitest';
import { calculateMethodCost, compareConstructionMethods } from './compare';
import type { ConstructionMethod } from '../types/method';

function makeMethod(id: string, relativeCostFactor: number): ConstructionMethod {
  return {
    id,
    nameKey: `methods.${id}.name`,
    descriptionKey: `methods.${id}.description`,
    prosKeys: [],
    consKeys: [],
    speed: 3,
    difficulty: 3,
    durability: 3,
    maintenance: 3,
    wasteLevel: 3,
    skillRequired: 3,
    relativeCostFactor,
    materialIds: [],
    toolIds: [],
  };
}

describe('compare', () => {
  it('calcula custo do método = base x fator x área', () => {
    const method = makeMethod('masonry', 1.0);
    expect(calculateMethodCost(method, 1500, 100)).toBe(150000);
  });

  it('compara dois métodos e calcula diferença absoluta e percentual', () => {
    const a = makeMethod('masonry', 1.0);
    const b = makeMethod('steel-frame', 1.2);
    const result = compareConstructionMethods(a, b, 1500, 100);
    expect(result.totalA).toBe(150000);
    expect(result.totalB).toBe(180000);
    expect(result.diffAbs).toBe(30000);
    expect(result.diffPercent).toBeCloseTo(20, 5);
  });
});
