/**
 * Validação de entradas do motor de cálculo. Nenhuma função de cálculo deve
 * deixar NaN/Infinity/valores absurdos vazarem para a UI — tudo é validado
 * na borda e reportado como um erro amigável e traduzível.
 */

/** Erro de entrada de cálculo — a UI captura e traduz `reasonKey`. */
export class CalculationInputError extends Error {
  public readonly fieldKey: string;
  public readonly reasonKey: string;

  constructor(fieldKey: string, reasonKey: string, message?: string) {
    super(message ?? `Invalid input for ${fieldKey}: ${reasonKey}`);
    this.name = 'CalculationInputError';
    this.fieldKey = fieldKey;
    this.reasonKey = reasonKey;
  }
}

const MAX_REASONABLE_VALUE = 1_000_000;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function assertPositiveNumber(value: unknown, fieldKey: string): number {
  if (!isFiniteNumber(value)) {
    throw new CalculationInputError(fieldKey, 'errors.mustBeNumber');
  }
  if (value <= 0) {
    throw new CalculationInputError(fieldKey, 'errors.mustBePositive');
  }
  if (value > MAX_REASONABLE_VALUE) {
    throw new CalculationInputError(fieldKey, 'errors.tooLarge');
  }
  return value;
}

export function assertNonNegativeNumber(value: unknown, fieldKey: string): number {
  if (!isFiniteNumber(value)) {
    throw new CalculationInputError(fieldKey, 'errors.mustBeNumber');
  }
  if (value < 0) {
    throw new CalculationInputError(fieldKey, 'errors.mustBeNonNegative');
  }
  if (value > MAX_REASONABLE_VALUE) {
    throw new CalculationInputError(fieldKey, 'errors.tooLarge');
  }
  return value;
}

export function assertInRange(
  value: unknown,
  min: number,
  max: number,
  fieldKey: string,
): number {
  if (!isFiniteNumber(value)) {
    throw new CalculationInputError(fieldKey, 'errors.mustBeNumber');
  }
  if (value < min || value > max) {
    throw new CalculationInputError(fieldKey, 'errors.outOfRange');
  }
  return value;
}

export function assertPositiveInteger(value: unknown, fieldKey: string): number {
  const num = assertPositiveNumber(value, fieldKey);
  if (!Number.isInteger(num)) {
    throw new CalculationInputError(fieldKey, 'errors.mustBeInteger');
  }
  return num;
}
