export interface PaintTypeDefinition {
  id: string;
  nameKey: string;
  materialId: string;
  /** rendimento de referência do fabricante — sempre "confira a lata" na UI */
  yieldM2PerLiter: number;
}

export const paintTypeCatalog: PaintTypeDefinition[] = [
  {
    id: 'latex-pva',
    nameKey: 'paints.latexPva',
    materialId: 'latex-paint-18l',
    yieldM2PerLiter: 6,
  },
  {
    id: 'acrylic-premium',
    nameKey: 'paints.acrylicPremium',
    materialId: 'acrylic-paint-18l',
    yieldM2PerLiter: 12,
  },
];

export function findPaintType(id: string): PaintTypeDefinition | undefined {
  return paintTypeCatalog.find((p) => p.id === id);
}
