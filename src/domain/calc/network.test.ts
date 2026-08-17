import { describe, it, expect } from 'vitest';
import { calculateNetworkEstimate } from './network';
import { CalculationInputError } from '../validation';

describe('network', () => {
  it('estima cabo, conectores e patch cords a partir dos pontos', () => {
    const result = calculateNetworkEstimate(4, 15);
    expect(result.cableMetersEstimate).toBe(60);
    expect(result.connectorsEstimate).toBe(8); // 2 RJ45 por cabo (ambas as pontas)
    expect(result.patchCordsEstimate).toBe(4);
  });

  it('usa 15m por ponto como padrao', () => {
    const result = calculateNetworkEstimate(2);
    expect(result.cableMetersEstimate).toBe(30);
  });

  it('rejeita numero de pontos invalido', () => {
    expect(() => calculateNetworkEstimate(0)).toThrow(CalculationInputError);
    expect(() => calculateNetworkEstimate(-2)).toThrow(CalculationInputError);
    expect(() => calculateNetworkEstimate(1.2)).toThrow(CalculationInputError);
  });
});
