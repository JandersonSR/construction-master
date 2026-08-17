import { describe, it, expect } from 'vitest';
import { calculatePaintLiters } from './paint';
import { CalculationInputError } from '../validation';

describe('paint', () => {
  it('calcula litros com rendimento e 2 demãos default', () => {
    const result = calculatePaintLiters(60, 6);
    expect(result.liters).toBe(20); // (60*2)/6
    expect(result.coats).toBe(2);
  });

  it('escala com número de demãos', () => {
    const result = calculatePaintLiters(60, 6, 3);
    expect(result.liters).toBe(30);
  });

  it('rejeita demãos não inteiras', () => {
    expect(() => calculatePaintLiters(60, 6, 1.5)).toThrow(CalculationInputError);
  });

  it('rejeita rendimento zero', () => {
    expect(() => calculatePaintLiters(60, 0)).toThrow(CalculationInputError);
  });
});
