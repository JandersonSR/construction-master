import type {
  ChecklistItem,
  Project,
  ProjectStage,
  Room,
  StageMaterialLine,
} from '../domain/types';
import { stageDefinitions } from '../construction/stages';
import { calculateStageLaborCost } from '../domain/calc';

const DEMO_PROJECT_ID = 'demo-chacara-250m2';

function makeChecklist(stageId: string, doneCount: number): ChecklistItem[] {
  const def = stageDefinitions.find((s) => s.id === stageId);
  const labels = def?.checklistItemKeys ?? [];
  return labels.map((labelKey, i) => ({
    id: `${stageId}-check-${i}`,
    labelKey,
    done: i < doneCount,
  }));
}

function materialLine(
  materialId: string,
  quantity: number,
  unit: StageMaterialLine['unit'],
  purchased: boolean,
): StageMaterialLine {
  return { materialId, quantity, unit, purchased };
}

/**
 * Gera a obra de demonstração "Chácara — Casa 250m²", usada para popular o
 * app na primeira execução (ver `useSeedDemoProject`). Dados fictícios,
 * mas com etapas, materiais e custos coerentes com o motor de cálculo real.
 */
export function buildDemoProject(): Project {
  const now = new Date().toISOString();

  const rooms: Room[] = [
    { id: 'room-living', name: 'Sala de estar', area: 32 },
    { id: 'room-kitchen', name: 'Cozinha', area: 18 },
    { id: 'room-suite1', name: 'Suíte master', area: 22 },
    { id: 'room-bed2', name: 'Quarto 2', area: 14 },
    { id: 'room-bed3', name: 'Quarto 3', area: 14 },
    { id: 'room-bath1', name: 'Banheiro social', area: 6 },
    { id: 'room-bath2', name: 'Banheiro da suíte', area: 7 },
    { id: 'room-service', name: 'Área de serviço', area: 9 },
    { id: 'room-garage', name: 'Garagem', area: 38 },
    { id: 'room-porch', name: 'Varanda', area: 20 },
  ];

  const planningLabor = { workers: 0, dailyRate: 0, days: 0 };

  const stageConfig: Record<
    string,
    {
      status: ProjectStage['status'];
      laborMode: ProjectStage['laborMode'];
      daily?: { workers: number; dailyRate: number; days: number };
      contract?: { totalValue: number };
      materials: StageMaterialLine[];
      checklistDone: number;
      actualCost?: number;
    }
  > = {
    planning: {
      status: 'done',
      laborMode: 'diy',
      materials: [],
      checklistDone: 4,
      actualCost: 0,
    },
    design: {
      status: 'done',
      laborMode: 'contract',
      contract: { totalValue: 8500 },
      materials: [],
      checklistDone: 3,
      actualCost: 8500,
    },
    'site-work': {
      status: 'done',
      laborMode: 'daily',
      daily: { workers: 3, dailyRate: 180, days: 4 },
      materials: [],
      checklistDone: 3,
      actualCost: 2160,
    },
    foundation: {
      status: 'done',
      laborMode: 'contract',
      contract: { totalValue: 32000 },
      materials: [
        materialLine('ready-concrete-m3', 18, 'm3', true),
        materialLine('rebar-10mm', 120, 'unit', true),
      ],
      checklistDone: 6,
      actualCost: 34500,
    },
    structure: {
      status: 'done',
      laborMode: 'contract',
      contract: { totalValue: 41000 },
      materials: [
        materialLine('ready-concrete-m3', 22, 'm3', true),
        materialLine('rebar-10mm', 210, 'unit', true),
      ],
      checklistDone: 3,
      actualCost: 43200,
    },
    masonry: {
      status: 'in_progress',
      laborMode: 'daily',
      daily: { workers: 2, dailyRate: 170, days: 30 },
      materials: [
        materialLine('ceramic-block-9x19x39', 5200, 'unit', true),
        materialLine('ready-mortar-20kg', 180, 'bag', true),
      ],
      checklistDone: 3,
      actualCost: 21400,
    },
    slabs: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 28000 },
      materials: [],
      checklistDone: 0,
    },
    roofing: {
      status: 'not_started',
      laborMode: 'daily',
      daily: { workers: 3, dailyRate: 190, days: 12 },
      materials: [
        materialLine('ceramic-tile-m2', 300, 'm2', false),
        materialLine('roof-structure-wood-m2', 280, 'm2', false),
      ],
      checklistDone: 0,
    },
    waterproofing: {
      status: 'not_started',
      laborMode: 'daily',
      daily: { workers: 2, dailyRate: 160, days: 4 },
      materials: [],
      checklistDone: 0,
    },
    frames: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 18000 },
      materials: [],
      checklistDone: 0,
    },
    hydraulic: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 15000 },
      materials: [
        materialLine('pvc-pipe-25mm-6m', 60, 'unit', false),
        materialLine('pvc-pipe-100mm-6m', 25, 'unit', false),
      ],
      checklistDone: 0,
    },
    sanitary: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 9000 },
      materials: [],
      checklistDone: 0,
    },
    electrical: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 22000 },
      materials: [
        materialLine('cable-2-5mm-m', 800, 'm', false),
        materialLine('electrical-outlet-unit', 60, 'unit', false),
        materialLine('circuit-breaker-unit', 18, 'unit', false),
      ],
      checklistDone: 0,
    },
    network: { status: 'not_started', laborMode: 'diy', materials: [], checklistDone: 0 },
    telephony: {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
    hvac: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 12000 },
      materials: [],
      checklistDone: 0,
    },
    'solar-power': {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 35000 },
      materials: [],
      checklistDone: 0,
    },
    'solar-heating': {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
    flooring: {
      status: 'not_started',
      laborMode: 'daily',
      daily: { workers: 2, dailyRate: 180, days: 15 },
      materials: [materialLine('porcelain-tile-box', 95, 'box', false)],
      checklistDone: 0,
    },
    'wall-covering': {
      status: 'not_started',
      laborMode: 'daily',
      daily: { workers: 2, dailyRate: 170, days: 8 },
      materials: [],
      checklistDone: 0,
    },
    drywall: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 9500 },
      materials: [],
      checklistDone: 0,
    },
    painting: {
      status: 'not_started',
      laborMode: 'diy',
      materials: [materialLine('acrylic-paint-18l', 14, 'unit', false)],
      checklistDone: 0,
    },
    doors: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 11000 },
      materials: [],
      checklistDone: 0,
    },
    deck: { status: 'not_started', laborMode: 'diy', materials: [], checklistDone: 0 },
    pool: {
      status: 'not_started',
      laborMode: 'contract',
      contract: { totalValue: 45000 },
      materials: [],
      checklistDone: 0,
    },
    jacuzzi: { status: 'not_started', laborMode: 'diy', materials: [], checklistDone: 0 },
    'outdoor-area': {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
    landscaping: {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
    finishes: {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
    'final-inspection': {
      status: 'not_started',
      laborMode: 'diy',
      materials: [],
      checklistDone: 0,
    },
  };

  const stages: ProjectStage[] = stageDefinitions.map((def) => {
    const cfg = stageConfig[def.id] ?? {
      status: 'not_started' as const,
      laborMode: 'diy' as const,
      materials: [],
      checklistDone: 0,
    };
    const laborConfig = {
      daily: cfg.daily,
      contract: cfg.contract,
    };
    const estimatedLabor = calculateSafeLaborCost(cfg.laborMode, laborConfig);
    return {
      id: `${def.id}-stage`,
      stageDefId: def.id,
      status: cfg.status,
      laborMode: cfg.laborMode,
      laborConfig,
      materials: cfg.materials,
      checklist: makeChecklist(def.id, cfg.checklistDone),
      estimatedCost: estimatedLabor,
      actualCost: cfg.actualCost,
      notes: undefined,
    };
  });

  void planningLabor;

  return {
    id: DEMO_PROJECT_ID,
    name: 'Chácara — Casa 250m²',
    location: 'Atibaia/SP',
    type: 'house',
    purpose: 'Moradia própria + lazer de fim de semana',
    floors: 1,
    dimensions: {
      length: 20,
      width: 12.5,
      height: 2.8,
      area: 250,
      perimeter: 65,
      doors: 12,
      windows: 16,
    },
    constructionMethodId: 'conventional-masonry',
    finishLevel: 'standard',
    rooms,
    stages,
    laborMode: 'mixed',
    priceOverrides: {},
    createdAt: now,
    updatedAt: now,
  };
}

function calculateSafeLaborCost(
  mode: ProjectStage['laborMode'],
  config: {
    daily?: { workers: number; dailyRate: number; days: number };
    contract?: { totalValue: number };
  },
): number {
  try {
    return calculateStageLaborCost(mode, config);
  } catch {
    return 0;
  }
}

export { DEMO_PROJECT_ID };
