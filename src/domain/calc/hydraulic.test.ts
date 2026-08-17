import { describe, it, expect } from 'vitest';
import { calculateHydraulicRoughEstimate } from './hydraulic';
import { CalculationInputError } from '../validation';

describe('hydraulic', () => {
  it('estima metragem de tubo e conexoes a partir dos pontos', () => {
    const result = calculateHydraulicRoughEstimate(5, 3, 4);
    expect(result.pipeMetersEstimate).toBe(15);
    expect(result.connectionsEstimate).toBe(20);
  });

  it('usa valores padrao quando meterosPerPoint/connectionsPerPoint nao sao informados', () => {
    const result = calculateHydraulicRoughEstimate(10);
    expect(result.pipeMetersEstimate).toBe(30);
    expect(result.connectionsEstimate).toBe(40);
  });

  it('rejeita numero de pontos nao inteiro', () => {
    expect(() => calculateHydraulicRoughEstimate(2.5)).toThrow(CalculationInputError);
  });

  it('rejeita numero de pontos negativo ou zero', () => {
    expect(() => calculateHydraulicRoughEstimate(0)).toThrow(CalculationInputError);
    expect(() => calculateHydraulicRoughEstimate(-3)).toThrow(CalculationInputError);
  });
});
