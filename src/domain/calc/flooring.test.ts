import { describe, it, expect } from 'vitest';
import { calculateFlooringMaterials } from './flooring';
import { CalculationInputError } from '../validation';

describe('flooring', () => {
  it('arredonda caixas para cima (única exceção documentada)', () => {
    // 20m2 net, 10% perda = 22m2, caixa cobre 2m2 -> 11 caixas exatas
    const exact = calculateFlooringMaterials(20, 2, 4, 0.5, 10);
    expect(exact.boxes).toBe(11);

    // 21m2 net, 10% perda = 23.1m2, caixa cobre 2m2 -> 11.55 -> 12 caixas
    const rounded = calculateFlooringMaterials(21, 2, 4, 0.5, 10);
    expect(rounded.boxes).toBe(12);
    expect(rounded.roundedUp).toBe(true);
  });

  it('calcula argamassa e rejunte proporcionalmente à área líquida', () => {
    const result = calculateFlooringMaterials(20, 2, 4, 0.5, 10);
    expect(result.mortarKg).toBe(80);
    expect(result.groutKg).toBe(10);
  });

  it('rejeita perda negativa', () => {
    expect(() => calculateFlooringMaterials(20, 2, 4, 0.5, -5)).toThrow(
      CalculationInputError,
    );
  });
});
