/**
 * Unidades suportadas pelo sistema. A V1 usa exclusivamente o sistema
 * métrico; a estrutura já separa "unidade" de "valor" para permitir uma
 * futura conversão para o sistema imperial (ver docs/ROADMAP.md V2).
 */
export type Unit =
  | 'm'
  | 'cm'
  | 'mm'
  | 'm2'
  | 'm3'
  | 'kg'
  | 'g'
  | 'L'
  | 'unit'
  | 'bag'
  | 'box'
  | 'roll'
  | 'kWp'
  | 'BRL';

export type SafetyLevel = 'none' | 'recommended' | 'required';
