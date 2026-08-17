import type { BlockDefinition } from '../calc/masonry';

/**
 * Catálogo de blocos/tijolos para a calculadora de alvenaria
 * (`calc/masonry.ts`). `coverageAreaM2` e `mortarM3PerM2` são valores de
 * referência de mercado (bloco padrão + junta de ~1cm) — sobrescrevíveis.
 */
export const blockCatalog: BlockDefinition[] = [
  {
    id: 'ceramic-block-9x19x39',
    nameKey: 'materials.ceramicBlock',
    coverageAreaM2: 0.135,
    mortarM3PerM2: 0.02,
  },
  {
    id: 'concrete-block-14x19x39',
    nameKey: 'materials.concreteBlock',
    coverageAreaM2: 0.135,
    mortarM3PerM2: 0.022,
  },
  {
    id: 'eco-brick',
    nameKey: 'materials.ecoBrick',
    coverageAreaM2: 0.09,
    mortarM3PerM2: 0.008,
  },
];

export function findBlock(id: string): BlockDefinition | undefined {
  return blockCatalog.find((b) => b.id === id);
}
