import { describe, it, expect } from 'vitest';
import { calculateDeckMaterials, calculatePoolLoadEstimate } from './deck';
import { CalculationInputError } from '../validation';

describe('deck', () => {
  it('calcula área, tábuas, vigotas e parafusos', () => {
    const result = calculateDeckMaterials(4, 3, 0.15, 0.4);
    expect(result.deckAreaM2).toBe(12);
    expect(result.boards).toBeGreaterThan(0);
    expect(result.joists).toBe(Math.ceil(4 / 0.4) + 1);
    expect(result.screws).toBe(result.boards * 12);
  });

  it('rejeita espaçamento de vigota inválido', () => {
    expect(() => calculateDeckMaterials(4, 3, 0.15, 0)).toThrow(CalculationInputError);
  });
});

describe('poolLoad', () => {
  it('soma peso da água (1000kg/m3) e da estrutura informada', () => {
    const result = calculatePoolLoadEstimate(10, 500);
    expect(result.waterWeightKg).toBe(10000);
    expect(result.totalLoadKg).toBe(10500);
  });

  it('nunca declara segurança — apenas retorna pesos numéricos', () => {
    const result = calculatePoolLoadEstimate(5, 200);
    expect(Object.keys(result)).not.toContain('safe');
    expect(Object.keys(result)).not.toContain('isSafe');
  });
});
