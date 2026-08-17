import { describe, it, expect } from 'vitest';
import {
  assertPositiveNumber,
  assertNonNegativeNumber,
  assertInRange,
  assertPositiveInteger,
  CalculationInputError,
} from './validation';

describe('validation', () => {
  it('assertPositiveNumber aceita números positivos', () => {
    expect(assertPositiveNumber(5, 'x')).toBe(5);
  });

  it('assertPositiveNumber rejeita zero', () => {
    expect(() => assertPositiveNumber(0, 'x')).toThrow(CalculationInputError);
  });

  it('assertPositiveNumber rejeita negativos', () => {
    expect(() => assertPositiveNumber(-1, 'x')).toThrow(CalculationInputError);
  });

  it('assertPositiveNumber rejeita texto (ex.: campo de formulário vazio digitado como string)', () => {
    expect(() => assertPositiveNumber('abc' as unknown, 'x')).toThrow(
      CalculationInputError,
    );
  });

  it('assertPositiveNumber rejeita vazio/NaN', () => {
    expect(() => assertPositiveNumber(NaN, 'x')).toThrow(CalculationInputError);
  });

  it('assertPositiveNumber rejeita valores absurdamente grandes', () => {
    expect(() => assertPositiveNumber(10_000_000, 'x')).toThrow(CalculationInputError);
  });

  it('assertNonNegativeNumber aceita zero', () => {
    expect(assertNonNegativeNumber(0, 'x')).toBe(0);
  });

  it('assertNonNegativeNumber rejeita negativos', () => {
    expect(() => assertNonNegativeNumber(-0.01, 'x')).toThrow(CalculationInputError);
  });

  it('assertInRange valida limites inclusivos', () => {
    expect(assertInRange(45, 0, 89, 'pitch')).toBe(45);
    expect(() => assertInRange(90, 0, 89, 'pitch')).toThrow(CalculationInputError);
  });

  it('assertPositiveInteger rejeita não-inteiros', () => {
    expect(() => assertPositiveInteger(2.5, 'workers')).toThrow(CalculationInputError);
    expect(assertPositiveInteger(3, 'workers')).toBe(3);
  });
});
