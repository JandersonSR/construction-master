#!/usr/bin/env -S node
/**
 * Verificação rápida e zero-dependência do motor de cálculo puro
 * (src/domain/calc). Não substitui `npm test` (Vitest, a suíte oficial do
 * projeto) — serve para conferir a matemática mesmo antes de rodar
 * `npm install`, usando apenas `tsx` (ou `ts-node`) para executar TypeScript
 * diretamente.
 *
 * Uso:
 *   npx tsx scripts/sanity-check.mjs
 *
 * Este script foi o que validou o motor de cálculo durante o
 * desenvolvimento inicial da V1, num ambiente sem acesso ao registro do
 * npm (ver docs/ARCHITECTURE.md secao 0).
 */
import assert from 'node:assert/strict';
import {
  calculateArea,
  calculateRectanglePerimeter,
  calculateWallArea,
  calculateVolume,
  calculateConcreteMaterials,
  calculateMasonryMaterials,
  calculateFlooringMaterials,
  calculatePaintLiters,
  calculateRoofMaterials,
  calculateDeckMaterials,
  calculatePoolLoadEstimate,
  calculateSolarSystem,
  calculateHydraulicRoughEstimate,
  calculateElectricalRoughEstimate,
  calculateNetworkEstimate,
  calculateSolarHeatingSystem,
  calculateDailyLaborCost,
  calculateStageLaborCost,
  calculateProjectBudget,
  simulateDiySavings,
  compareConstructionMethods,
} from '../src/domain/calc/index.ts';
import { extractYoutubeId } from '../src/videos/types.ts';

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(err instanceof Error ? err.message : err);
  }
}

console.log('Construction Master — sanity check do motor de cálculo\n');

check('area = comprimento x largura', () => {
  assert.equal(calculateArea(5, 4), 20);
});

check('perimetro do retangulo', () => {
  assert.equal(calculateRectanglePerimeter(5, 4), 18);
});

check('area de parede com vaos (exemplo da doc)', () => {
  const perimeter = calculateRectanglePerimeter(5, 4);
  const area = calculateWallArea(perimeter, 2.8, 2.8);
  assert.ok(Math.abs(area - 47.6) < 1e-9, `esperado ~47.6, obtido ${area}`);
});

check('volume = comprimento x largura x altura', () => {
  assert.equal(calculateVolume(2, 3, 4), 24);
});

check('concreto: traco default gera 7.2 sacos de cimento por m3', () => {
  const r = calculateConcreteMaterials(1, 1, 1);
  assert.ok(Math.abs(r.cementBags - 7.2) < 1e-9);
});

check('alvenaria: unidades escalam com perda', () => {
  const block = { id: 'x', nameKey: 'x', coverageAreaM2: 0.135, mortarM3PerM2: 0.02 };
  const r = calculateMasonryMaterials(50, block, 10);
  const net = 50 / 0.135;
  assert.ok(Math.abs(r.units - net * 1.1) < 1e-6);
});

check('piso: caixas sempre arredondam para cima', () => {
  const r = calculateFlooringMaterials(21, 2, 4, 0.5, 10);
  assert.equal(r.boxes, 12);
  assert.equal(r.roundedUp, true);
});

check('pintura: litros = (area*demaos)/rendimento', () => {
  const r = calculatePaintLiters(60, 6);
  assert.equal(r.liters, 20);
});

check('telhado: area real cresce com a inclinacao', () => {
  const flat = calculateRoofMaterials(100, 0, 1);
  const pitched = calculateRoofMaterials(100, 30, 1);
  assert.ok(pitched.roofAreaM2 > flat.roofAreaM2);
});

check('deck: area e numero de vigotas', () => {
  const r = calculateDeckMaterials(4, 3, 0.15, 0.4);
  assert.equal(r.deckAreaM2, 12);
  assert.ok(r.joists > 0);
});

check('piscina sobre deck: peso da agua = volume * 1000kg, sem declarar seguranca', () => {
  const r = calculatePoolLoadEstimate(10, 500);
  assert.equal(r.waterWeightKg, 10000);
  assert.equal(r.totalLoadKg, 10500);
  assert.ok(!('safe' in r) && !('isSafe' in r));
});

check('solar: consumo diario e payback', () => {
  const r = calculateSolarSystem(300, 550, 2.6, 15000, 250, 4.5, 0.75);
  assert.equal(r.dailyConsumptionKwh, 10);
  assert.ok(Math.abs(r.paybackMonths - 60) < 1e-6);
});

check('hidraulica: estimativa escala com numero de pontos', () => {
  const r = calculateHydraulicRoughEstimate(5, 3, 4);
  assert.equal(r.pipeMetersEstimate, 15);
  assert.equal(r.connectionsEstimate, 20);
});

check('eletrica: tomadas/interruptores/circuitos a partir dos comodos', () => {
  const r = calculateElectricalRoughEstimate(6, 4);
  assert.equal(r.outletsEstimate, 24);
  assert.equal(r.switchesEstimate, 6);
  assert.equal(r.cableMetersEstimate, 150);
  assert.equal(r.circuitsEstimate, 5);
});

check('rede: cabo/conectores/patch cords a partir dos pontos', () => {
  const r = calculateNetworkEstimate(4, 15);
  assert.equal(r.cableMetersEstimate, 60);
  assert.equal(r.connectorsEstimate, 8);
  assert.equal(r.patchCordsEstimate, 4);
});

check('aquecimento solar: reservatorio e numero de coletores', () => {
  const r = calculateSolarHeatingSystem(4, 1.5, 60);
  assert.equal(r.reservoirLiters, 240);
  assert.equal(r.collectorsCount, 3);
});

check('youtube: extrai ID de watch?v=, youtu.be, embed e shorts', () => {
  assert.equal(extractYoutubeId('https://www.youtube.com/watch?v=zLZ6jCOYK_k'), 'zLZ6jCOYK_k');
  assert.equal(extractYoutubeId('https://youtu.be/abc123XYZ_'), 'abc123XYZ_');
  assert.equal(extractYoutubeId('https://www.youtube-nocookie.com/embed/abc123XYZ_'), 'abc123XYZ_');
  assert.equal(extractYoutubeId('https://www.youtube.com/shorts/abc123XYZ_'), 'abc123XYZ_');
  assert.equal(extractYoutubeId('https://example.com/not-a-video'), null);
});

check('mao de obra: diaria = trabalhadores x diaria x dias', () => {
  assert.equal(calculateDailyLaborCost({ workers: 2, dailyRate: 150, days: 10 }), 3000);
});

check('mao de obra: DIY custa zero em dinheiro', () => {
  assert.equal(calculateStageLaborCost('diy', {}), 0);
});

check('orcamento: total = materiais + mao de obra + contingencia', () => {
  const summary = calculateProjectBudget({
    stages: [{ stageDefId: 'x', materialsCost: 9000, laborCost: 5000 }],
    areaM2: 100,
  });
  assert.ok(Math.abs(summary.total - 14000 * 1.1) < 1e-9);
});

check('simulador DIY: economia e percentual', () => {
  const r = simulateDiySavings(8000, 3000);
  assert.equal(r.savings, 5000);
  assert.ok(Math.abs(r.savingsPercent - 62.5) < 1e-9);
});

check('comparador de metodos: diferenca percentual', () => {
  const base = {
    id: 'a', nameKey: 'a', descriptionKey: 'a', prosKeys: [], consKeys: [],
    speed: 3, difficulty: 3, durability: 3, maintenance: 3, wasteLevel: 3, skillRequired: 3,
    materialIds: [], toolIds: [],
  };
  const a = { ...base, id: 'a', relativeCostFactor: 1.0 };
  const b = { ...base, id: 'b', relativeCostFactor: 1.2 };
  const r = compareConstructionMethods(a, b, 1500, 100);
  assert.equal(r.totalA, 150000);
  assert.equal(r.totalB, 180000);
  assert.ok(Math.abs(r.diffPercent - 20) < 1e-9);
});

console.log(`\n${passed} passaram, ${failed} falharam.`);
if (failed > 0) process.exit(1);
