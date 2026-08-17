import { describe, it, expect } from 'vitest';
import { calculateConcreteMaterials, DEFAULT_CONCRETE_TRACE } from './concrete';
import { CalculationInputError } from '../validation';

describe('concrete', () => {
  it('estima materiais para 1m3 com traço default (1:2:3)', () => {
    const result = calculateConcreteMaterials(1, 1, 1);
    expect(result.volumeM3).toBe(1);
    expect(result.cementBags).toBeCloseTo(7.2, 5);
    expect(result.sandM3).toBeCloseTo(0.52, 5);
    expect(result.gravelM3).toBeCloseTo(0.8, 5);
    expect(result.waterL).toBeCloseTo(180, 5);
    expect(result.trace).toBe('1:2:3');
  });

  it('escala linearmente com o volume', () => {
    const one = calculateConcreteMaterials(1, 1, 1);
    const two = calculateConcreteMaterials(2, 1, 1);
    expect(two.cementBags).toBeCloseTo(one.cementBags * 2, 5);
  });

  it('aceita traço customizado', () => {
    const customTrace = { ...DEFAULT_CONCRETE_TRACE, cementBagsPerM3: 10 };
    const result = calculateConcreteMaterials(1, 1, 1, customTrace);
    expect(result.cementBags).toBe(10);
  });

  it('rejeita dimensões inválidas', () => {
    expect(() => calculateConcreteMaterials(0, 1, 1)).toThrow(CalculationInputError);
  });
});
