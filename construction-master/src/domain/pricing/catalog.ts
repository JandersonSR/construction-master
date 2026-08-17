import type { MaterialDefinition } from '../types/material';

/**
 * Catálogo central de preços de referência. TODOS os preços aqui são
 * estimativas nacionais de referência (BRL, ordem de grandeza 2025) — a UI
 * SEMPRE rotula isso como "preço estimado, ajuste para sua região" (ver
 * `SafetyNotice`/`PriceDisclaimer`) e permite ao usuário sobrescrever cada
 * item via `PriceOverride` (persistido localmente).
 *
 * Nenhum preço deve ser hardcoded em componentes de UI — sempre importar
 * deste catálogo (ou de `resolvePrice`, que já aplica overrides do usuário).
 */
export const defaultPriceCatalog: MaterialDefinition[] = [
  // Cimento / agregados
  {
    id: 'cement-bag-50kg',
    nameKey: 'materials.cementBag50kg',
    unit: 'bag',
    category: 'cement',
    defaultPrice: 38,
  },
  {
    id: 'sand-m3',
    nameKey: 'materials.sandM3',
    unit: 'm3',
    category: 'aggregate',
    defaultPrice: 130,
  },
  {
    id: 'gravel-m3',
    nameKey: 'materials.gravelM3',
    unit: 'm3',
    category: 'aggregate',
    defaultPrice: 140,
  },
  {
    id: 'lime-bag-20kg',
    nameKey: 'materials.limeBag20kg',
    unit: 'bag',
    category: 'cement',
    defaultPrice: 22,
  },

  // Alvenaria
  {
    id: 'ceramic-block-9x19x39',
    nameKey: 'materials.ceramicBlock',
    unit: 'unit',
    category: 'masonry',
    defaultPrice: 1.9,
  },
  {
    id: 'concrete-block-14x19x39',
    nameKey: 'materials.concreteBlock',
    unit: 'unit',
    category: 'masonry',
    defaultPrice: 3.2,
  },
  {
    id: 'eco-brick',
    nameKey: 'materials.ecoBrick',
    unit: 'unit',
    category: 'masonry',
    defaultPrice: 2.6,
  },
  {
    id: 'ready-mortar-20kg',
    nameKey: 'materials.readyMortar20kg',
    unit: 'bag',
    category: 'masonry',
    defaultPrice: 24,
  },

  // Estrutura / aço
  {
    id: 'rebar-10mm-12m',
    nameKey: 'materials.rebar10mm',
    unit: 'unit',
    category: 'steel',
    defaultPrice: 45,
  },
  {
    id: 'tie-wire-kg',
    nameKey: 'materials.tieWireKg',
    unit: 'kg',
    category: 'steel',
    defaultPrice: 14,
  },
  {
    id: 'ready-concrete-m3',
    nameKey: 'materials.readyConcreteM3',
    unit: 'm3',
    category: 'cement',
    defaultPrice: 420,
  },

  // Madeira / deck
  {
    id: 'treated-wood-board-m2',
    nameKey: 'materials.treatedWoodBoardM2',
    unit: 'm2',
    category: 'wood',
    defaultPrice: 95,
  },
  {
    id: 'wpc-deck-board-m2',
    nameKey: 'materials.wpcDeckBoardM2',
    unit: 'm2',
    category: 'wood',
    defaultPrice: 180,
  },
  {
    id: 'wood-joist-m',
    nameKey: 'materials.woodJoistM',
    unit: 'm',
    category: 'wood',
    defaultPrice: 28,
  },
  {
    id: 'deck-screw-unit',
    nameKey: 'materials.deckScrewUnit',
    unit: 'unit',
    category: 'hardware',
    defaultPrice: 0.6,
  },

  // Cobertura
  {
    id: 'ceramic-tile-m2',
    nameKey: 'materials.ceramicTileM2',
    unit: 'm2',
    category: 'roofing',
    defaultPrice: 38,
  },
  {
    id: 'fiber-cement-tile-m2',
    nameKey: 'materials.fiberCementTileM2',
    unit: 'm2',
    category: 'roofing',
    defaultPrice: 32,
  },
  {
    id: 'metal-tile-m2',
    nameKey: 'materials.metalTileM2',
    unit: 'm2',
    category: 'roofing',
    defaultPrice: 55,
  },
  {
    id: 'roof-structure-wood-m2',
    nameKey: 'materials.roofStructureWoodM2',
    unit: 'm2',
    category: 'wood',
    defaultPrice: 60,
  },

  // Piso / revestimento
  {
    id: 'porcelain-tile-box',
    nameKey: 'materials.porcelainTileBox',
    unit: 'box',
    category: 'flooring',
    defaultPrice: 89,
  },
  {
    id: 'ceramic-floor-box',
    nameKey: 'materials.ceramicFloorBox',
    unit: 'box',
    category: 'flooring',
    defaultPrice: 55,
  },
  {
    id: 'vinyl-flooring-m2',
    nameKey: 'materials.vinylFlooringM2',
    unit: 'm2',
    category: 'flooring',
    defaultPrice: 65,
  },
  {
    id: 'laminate-flooring-m2',
    nameKey: 'materials.laminateFlooringM2',
    unit: 'm2',
    category: 'flooring',
    defaultPrice: 58,
  },
  {
    id: 'floor-mortar-20kg',
    nameKey: 'materials.floorMortar20kg',
    unit: 'bag',
    category: 'flooring',
    defaultPrice: 26,
  },
  {
    id: 'grout-1kg',
    nameKey: 'materials.grout1kg',
    unit: 'kg',
    category: 'flooring',
    defaultPrice: 18,
  },
  {
    id: 'baseboard-m',
    nameKey: 'materials.baseboardM',
    unit: 'm',
    category: 'flooring',
    defaultPrice: 12,
  },

  // Pintura
  {
    id: 'latex-paint-18l',
    nameKey: 'materials.latexPaint18L',
    unit: 'unit',
    category: 'paint',
    defaultPrice: 320,
  },
  {
    id: 'acrylic-paint-18l',
    nameKey: 'materials.acrylicPaint18L',
    unit: 'unit',
    category: 'paint',
    defaultPrice: 480,
  },
  {
    id: 'sealer-18l',
    nameKey: 'materials.sealer18L',
    unit: 'unit',
    category: 'paint',
    defaultPrice: 210,
  },
  {
    id: 'spackle-1kg',
    nameKey: 'materials.spackle1kg',
    unit: 'kg',
    category: 'paint',
    defaultPrice: 9,
  },

  // Hidráulica
  {
    id: 'pvc-pipe-25mm-6m',
    nameKey: 'materials.pvcPipe25mm',
    unit: 'unit',
    category: 'hydraulic',
    defaultPrice: 32,
  },
  {
    id: 'pvc-pipe-100mm-6m',
    nameKey: 'materials.pvcPipe100mm',
    unit: 'unit',
    category: 'hydraulic',
    defaultPrice: 98,
  },
  {
    id: 'pvc-connection-unit',
    nameKey: 'materials.pvcConnectionUnit',
    unit: 'unit',
    category: 'hydraulic',
    defaultPrice: 6,
  },
  {
    id: 'faucet-unit',
    nameKey: 'materials.faucetUnit',
    unit: 'unit',
    category: 'hydraulic',
    defaultPrice: 85,
  },
  {
    id: 'water-reservoir-1000l',
    nameKey: 'materials.waterReservoir1000L',
    unit: 'unit',
    category: 'hydraulic',
    defaultPrice: 780,
  },

  // Elétrica
  {
    id: 'electrical-outlet-unit',
    nameKey: 'materials.electricalOutletUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 18,
  },
  {
    id: 'light-switch-unit',
    nameKey: 'materials.lightSwitchUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 16,
  },
  {
    id: 'cable-2-5mm-m',
    nameKey: 'materials.cable2_5mmM',
    unit: 'm',
    category: 'electrical',
    defaultPrice: 3.2,
  },
  {
    id: 'circuit-breaker-unit',
    nameKey: 'materials.circuitBreakerUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 22,
  },
  {
    id: 'rcd-dr-unit',
    nameKey: 'materials.rcdDrUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 130,
  },
  {
    id: 'surge-protector-dps-unit',
    nameKey: 'materials.surgeProtectorDpsUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 90,
  },
  {
    id: 'conduit-m',
    nameKey: 'materials.conduitM',
    unit: 'm',
    category: 'electrical',
    defaultPrice: 4.5,
  },
  {
    id: 'electrical-panel-unit',
    nameKey: 'materials.electricalPanelUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 210,
  },

  // Rede / dados
  {
    id: 'utp-cable-m',
    nameKey: 'materials.utpCableM',
    unit: 'm',
    category: 'network',
    defaultPrice: 2.4,
  },
  {
    id: 'rj45-connector-unit',
    nameKey: 'materials.rj45ConnectorUnit',
    unit: 'unit',
    category: 'network',
    defaultPrice: 1.2,
  },
  {
    id: 'network-outlet-unit',
    nameKey: 'materials.networkOutletUnit',
    unit: 'unit',
    category: 'network',
    defaultPrice: 28,
  },
  {
    id: 'patch-panel-24p-unit',
    nameKey: 'materials.patchPanel24pUnit',
    unit: 'unit',
    category: 'network',
    defaultPrice: 320,
  },

  // Energia solar
  {
    id: 'solar-panel-550w-unit',
    nameKey: 'materials.solarPanel550wUnit',
    unit: 'unit',
    category: 'solar',
    defaultPrice: 750,
  },
  {
    id: 'solar-inverter-unit',
    nameKey: 'materials.solarInverterUnit',
    unit: 'unit',
    category: 'solar',
    defaultPrice: 4500,
  },
  {
    id: 'solar-collector-unit',
    nameKey: 'materials.solarCollectorUnit',
    unit: 'unit',
    category: 'solar',
    defaultPrice: 980,
  },
  {
    id: 'solar-boiler-unit',
    nameKey: 'materials.solarBoilerUnit',
    unit: 'unit',
    category: 'solar',
    defaultPrice: 1800,
  },

  // EV Charger
  {
    id: 'ev-charger-cable-m',
    nameKey: 'materials.evChargerCableM',
    unit: 'm',
    category: 'electrical',
    defaultPrice: 12,
  },
  {
    id: 'ev-charger-station-unit',
    nameKey: 'materials.evChargerStationUnit',
    unit: 'unit',
    category: 'electrical',
    defaultPrice: 3200,
  },
];

export function findMaterial(id: string): MaterialDefinition | undefined {
  return defaultPriceCatalog.find((m) => m.id === id);
}

/** Resolve o preço efetivo de um material aplicando overrides do usuário (globais e/ou por obra). */
export function resolveMaterialPrice(
  materialId: string,
  overrides: Record<string, number> = {},
): number {
  if (overrides[materialId] !== undefined) {
    return overrides[materialId];
  }
  const material = findMaterial(materialId);
  return material?.defaultPrice ?? 0;
}
