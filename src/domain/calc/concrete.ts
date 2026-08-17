import { assertPositiveNumber } from '../validation';
import { calculateVolume } from './geometry';

/**
 * Fatores de consumo por m³ de concreto para um traço específico.
 * Valores default (traço 1:2:3, cimento CP-II) são referência de mercado —
 * ver docs/CALCULATION_ENGINE.md §2. Sempre sobrescrevível.
 */
export interface ConcreteTraceFactors {
  traceLabel: string;
  cementBagsPerM3: number;
  sandM3PerM3: number;
  gravelM3PerM3: number;
  waterLPerM3: number;
}

export const DEFAULT_CONCRETE_TRACE: ConcreteTraceFactors = {
  traceLabel: '1:2:3',
  cementBagsPerM3: 7.2,
  sandM3PerM3: 0.52,
  gravelM3PerM3: 0.8,
  waterLPerM3: 180,
};

export interface ConcreteEstimate {
  volumeM3: number;
  cementBags: number;
  sandM3: number;
  gravelM3: number;
  waterL: number;
  trace: string;
}

/**
 * Estima materiais de concreto a partir de dimensões informadas pelo
 * usuário. Estimada — não substitui dimensionamento estrutural (ver
 * SafetyNotice obrigatório nas telas de fundação/estrutura).
 */
export function calculateConcreteMaterials(
  length: number,
  width: number,
  height: number,
  trace: ConcreteTraceFactors = DEFAULT_CONCRETE_TRACE,
): ConcreteEstimate {
  const volumeM3 = calculateVolume(length, width, height);
  return calculateConcreteMaterialsFromVolume(volumeM3, trace);
}

export function calculateConcreteMaterialsFromVolume(
  volumeM3: number,
  trace: ConcreteTraceFactors = DEFAULT_CONCRETE_TRACE,
): ConcreteEstimate {
  assertPositiveNumber(volumeM3, 'volumeM3');
  return {
    volumeM3,
    cementBags: volumeM3 * trace.cementBagsPerM3,
    sandM3: volumeM3 * trace.sandM3PerM3,
    gravelM3: volumeM3 * trace.gravelM3PerM3,
    waterL: volumeM3 * trace.waterLPerM3,
    trace: trace.traceLabel,
  };
}
