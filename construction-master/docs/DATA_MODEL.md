# Modelo de Dados — Construction Master

Todos os tipos abaixo vivem em `src/domain/types/*.ts` e são a fonte única de
verdade. Nada de duplicar shape de dados na UI.

## Project (Obra)

```ts
interface Project {
  id: string;
  name: string; // "Chácara — Casa 250m²"
  location?: string;
  type: ProjectType; // 'house' | 'renovation' | 'addition' | 'commercial' | 'other'
  purpose?: string; // finalidade: moradia, aluguel, etc.
  floors: number;
  dimensions: ProjectDimensions;
  constructionMethodId?: string; // referencia construction/methods.ts
  finishLevel: FinishLevel; // 'economy' | 'standard' | 'high'
  rooms: Room[];
  stages: ProjectStage[]; // instâncias das etapas para ESTA obra
  laborMode: LaborMode; // default para novas etapas
  priceOverrides: Record<string, number>; // materialId -> preço custom
  scenarioOf?: string; // id do projeto "pai", se este é um cenário alternativo
  createdAt: string; // ISO date
  updatedAt: string;
}

interface ProjectDimensions {
  length?: number; // m
  width?: number; // m
  height?: number; // m (pé-direito)
  area?: number; // m² — pode ser informado direto ou calculado
  perimeter?: number; // m — pode ser informado direto ou calculado
  doors?: number;
  windows?: number;
}

interface Room {
  id: string;
  name: string; // "Quarto 1", "Cozinha"
  area: number; // m²
  wallHeight?: number; // m — sobrescreve altura da obra se definido
}
```

## ConstructionStage (etapa — instância dentro de uma obra)

```ts
interface ProjectStage {
  id: string;
  stageDefId: string; // referencia StageDefinition (dados estáticos)
  status: 'not_started' | 'in_progress' | 'done';
  laborMode: LaborMode;
  laborConfig: LaborConfig;
  materials: StageMaterialLine[];
  checklist: ChecklistItem[];
  estimatedCost: number; // calculado, guardado para histórico
  actualCost?: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  note?: string;
  photoRef?: string; // referência a um blob salvo no IndexedDB
  date?: string;
}

interface StageMaterialLine {
  materialId: string; // referencia domain/pricing/catalog.ts
  quantity: number;
  unit: Unit;
  unitPriceOverride?: number;
  purchased: boolean;
}
```

## StageDefinition (dados estáticos — não pertence a uma obra específica)

```ts
interface StageDefinition {
  id: string; // 'foundation', 'masonry', ...
  order: number;
  category: string;
  requiresProfessional: SafetyLevel; // 'none' | 'recommended' | 'required'
  tools: { essential: string[]; optional: string[]; safety: string[] };
  steps: string[]; // chaves de i18n, passo a passo
  commonMistakes: string[];
  tips: string[];
  relatedVideoIds: string[];
}
```

## LaborMode / LaborConfig

```ts
type LaborMode = 'diy' | 'daily' | 'contract' | 'mixed';

interface LaborConfig {
  diy?: {};
  daily?: { workers: number; dailyRate: number; days: number };
  contract?: { totalValue: number };
  mixed?: MixedLaborAssignment[]; // combina diaristas por especialidade
}

interface MixedLaborAssignment {
  role: string; // 'pedreiro' | 'eletricista' | 'encanador' | 'pintor' | 'outro'
  mode: 'daily' | 'contract';
  workers?: number;
  dailyRate?: number;
  days?: number;
  totalValue?: number;
}
```

## Material / Price Catalog

```ts
interface MaterialDefinition {
  id: string;
  name: string; // chave i18n
  unit: Unit;
  category: MaterialCategory; // 'cement' | 'masonry' | 'wood' | 'paint' | 'hydraulic' | ...
  defaultPrice: number; // BRL de referência — SEMPRE rotulado como estimativa
  source?: string;
  lastUpdated?: string;
}

interface PriceOverride {
  materialId: string;
  price: number;
  supplier?: string;
  date: string;
  note?: string;
}
```

## ConstructionMethod

```ts
interface ConstructionMethod {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  speed: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5;
  durability: 1 | 2 | 3 | 4 | 5;
  maintenance: 1 | 2 | 3 | 4 | 5;
  wasteLevel: 1 | 2 | 3 | 4 | 5;
  skillRequired: 1 | 2 | 3 | 4 | 5;
  relativeCostFactor: number; // multiplicador aplicado ao custo base por m² (1 = referência)
  materials: string[]; // materialIds típicos
  tools: string[];
}
```

## Budget (derivado — calculado, não persistido em duplicidade)

```ts
interface BudgetSummary {
  materialsCost: number;
  laborCost: number;
  toolsCost: number;
  otherCost: number;
  contingency: number;
  total: number;
  costPerSquareMeter: number;
  byStage: { stageDefId: string; materials: number; labor: number; total: number }[];
}
```

## Persistência (IndexedDB via Dexie)

Bancos/tabelas:

- `projects` — um registro por `Project` (inclui `stages` embutido — volume
  baixo, não justifica normalização em V1).
- `priceOverrides` — overrides de preço **globais** do usuário (aplicados a
  todas as obras; overrides por-obra ficam em `project.priceOverrides`).
- `settings` — idioma, tema, unidade preferida, etc. (chave-valor).
- `photos` — blobs referenciados por `ChecklistItem.photoRef`.

Export/Import: serializa `projects` + `priceOverrides` + `settings` para um
único JSON versionado (`{ version: 1, exportedAt, data: {...} }`).
