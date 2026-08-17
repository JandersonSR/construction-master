# Motor de Cálculo — Construction Master

Todas as funções descritas aqui vivem em `src/domain/calc/*.ts`, são **puras**
(sem I/O, sem estado), documentadas com JSDoc e cobertas por testes em
`src/domain/calc/*.test.ts`. Nenhum arredondamento acontece dentro das
funções — elas retornam `number` em precisão total; o arredondamento é
responsabilidade exclusiva da camada de apresentação (`utils/format.ts`).

Convenção geral: todas as fórmulas assumem **unidades métricas (m, m², m³,
kg, L)**. Conversões para imperial ficam em `utils/units.ts` (preparado, não
ativado na V1 — ver roadmap).

Toda função abaixo é classificada como:

- **Exata** — geometria pura, sem premissa técnica (ex.: área = comprimento × largura).
- **Estimada** — usa um índice de consumo (traço, rendimento) reconhecido no
  mercado da construção civil, mas que varia por fabricante/condições reais.
- **Aproximada/dependente de projeto** — nunca deve ser tratada como
  dimensionamento final (ex.: nada relacionado a fundação/estrutura/elétrica
  de potência calcula uma "resposta certa"; calcula apenas quantidades de
  material a partir de dimensões que o usuário já decidiu).

---

## 1. Geometria (`calc/geometry.ts`) — Exata

```
calculateArea(length, width) = length * width                        [m²]
calculateRectanglePerimeter(length, width) = 2 * (length + width)     [m]
calculateWallArea(perimeter, height, openingsArea = 0) =
    perimeter * height - openingsArea                                [m²]
calculateVolume(length, width, height) = length * width * height      [m³]
```

Exemplo: parede de um cômodo 5m × 4m, pé-direito 2,8m, 1 porta (1,6m²) e
1 janela (1,2m²):
`perimeter = 2*(5+4) = 18m`; `wallArea = 18*2.8 - 2.8 = 47.6m²`.

Validação: comprimento/largura/altura devem ser `> 0`; caso contrário a
função lança `CalculationInputError` com mensagem amigável traduzível
(nunca deixa `NaN`/`Infinity` vazar para a UI).

---

## 2. Concreto (`calc/concrete.ts`) — Estimada

Traço volumétrico configurável (padrão 1:2:3 cimento:areia:brita para
concreto estrutural convencional — **traço é parâmetro, não constante
oculta**, pode ser sobrescrito).

```
volume = length * width * height                                     [m³]
consumptionFactor = traceFactors[traceKey]   // ex.: {cement: 7, sand: 0.5, gravel: 0.8}
cementBags = volume * consumptionFactor.cementBagsPerM3
sandM3     = volume * consumptionFactor.sandM3PerM3
gravelM3   = volume * consumptionFactor.gravelM3PerM3
waterL     = volume * consumptionFactor.waterLPerM3
```

Os fatores default (traço 1:2:3, cimento CP-II) usados são valores de
referência amplamente citados por fabricantes de cimento
(aprox. 7,2 sacos de 50kg / m³, 0,52 m³ areia / m³, 0,80 m³ brita / m³) —
**documentados como estimativa**, sobrescrevíveis via `TraceKey` customizado.
Sempre exibimos o traço usado junto ao resultado.

**Aviso obrigatório de segurança**: sempre que a função for chamada em
contexto de fundação, viga, pilar ou laje, a UI anexa `SafetyNotice`
("dimensionamento de concreto estrutural depende de projeto estrutural —
este cálculo estima apenas quantidade de material para o volume que você
informou").

---

## 3. Alvenaria (`calc/masonry.ts`) — Estimada

```
wallArea = calculateWallArea(...)                                     [m²]
netUnits = wallArea / blockDef.coverageAreaM2   // coverageAreaM2 = área que 1 bloco cobre já com junta
units = netUnits * (1 + wastePercent/100)
mortarM3 = wallArea * blockDef.mortarM3PerM2
```

Cada `BlockDefinition` (bloco cerâmico 9x19x39, bloco de concreto 14x19x39,
tijolo ecológico etc.) define sua própria `coverageAreaM2` e
`mortarM3PerM2` — valores de catálogo, documentados em
`src/domain/pricing/blocks.ts`, sobrescrevíveis. `wastePercent` default =
10% (perda usual de alvenaria), configurável pelo usuário.

---

## 4. Piso e Revestimento (`calc/flooring.ts`) — Estimada

```
netArea = roomArea
grossArea = netArea * (1 + wastePercent/100)
boxes = ceil(grossArea / boxCoverageM2)     // arredondamento de caixas é a ÚNICA exceção:
                                              // compra é sempre em caixas inteiras
mortarKg = netArea * mortarKgPerM2
groutKg  = netArea * groutKgPerM2
```

`wastePercent` default = 10% (padrão piso reto), 15% sugerido para
paginação diagonal — **é um parâmetro, o usuário pode alterar**. O
arredondamento para cima em `boxes` é a exceção documentada à regra "nunca
arredondar valores intermediários": compra de material cerâmico é sempre em
caixas fechadas, então esse arredondamento acontece no domínio (não na
apresentação) e é sinalizado explicitamente no resultado (`roundedUp:
true`).

---

## 5. Pintura (`calc/paint.ts`) — Estimada

```
paintableArea = wallArea + ceilingArea  (conforme o que o usuário incluir)
liters = (paintableArea * coats) / yieldM2PerLiter
```

`yieldM2PerLiter` (rendimento) é parametrizável por tipo de tinta
(látex PVA ≈ 6 m²/L por demão, acrílico premium ≈ 12 m²/L — valores de
catálogo em `src/domain/pricing/paints.ts`, sempre rotulados "rendimento de
referência do fabricante — confira a lata"). `coats` default = 2 demãos.

---

## 6. Telhado (`calc/roof.ts`) — Estimada

```
roofArea = footprintArea / cos(radians(pitchDegrees))     // área inclinada real
tiles = ceil(roofArea * (1 + wastePercent/100) / tileCoverageM2)
```

`pitchDegrees` (inclinação) é informado pelo usuário (ou 0 = telhado plano,
nesse caso `roofArea = footprintArea`). Estrutura (madeiramento/metálica) só
é estimada em número de peças por área — nunca em dimensionamento de carga
de vento/neve, que exige projeto. `SafetyNotice` sempre presente.

---

## 7. Deck (`calc/deck.ts`) — Estimada

```
deckArea = length * width
boards = ceil((deckArea / boardCoverageM2) * (1 + wastePercent/100))
joists = ceil(length / joistSpacingM) + 1     // por eixo perpendicular ao comprimento
screws = boards * screwsPerBoardEstimate
```

`boardCoverageM2` depende da largura útil da tábua informada pelo usuário.
Módulo de piscina sobre deck (`calc/poolLoad.ts`) calcula **apenas peso
estimado de água + estrutura** (`waterWeightKg = volumeM3 * 1000`), nunca
declara a estrutura seguranca — `SafetyNotice` de nível `required`.

---

## 8. Hidráulica / Elétrica / Rede / Solar / Aquecimento solar

Calculadoras "de estimativa de quantidade" (metragem de tubo/cabo por ponto,
número de tomadas por cômodo, número de painéis solares a partir de consumo
mensal). Nenhuma delas é dimensionamento normativo (NBR 5410, NBR 5626 etc.)
— são apenas listas de compras orientativas para planejamento e orçamento.
O nível de `SafetyNotice` exibido varia por calculadora, proporcional ao
risco de execução incorreta:

| Calculadora                  | Arquivo                | `SafetyNotice`                                       |
| ---------------------------- | ---------------------- | ---------------------------------------------------- |
| Hidráulica                   | `calc/hydraulic.ts`    | `recommended`                                        |
| Elétrica                     | `calc/electrical.ts`   | `required` (risco de choque/incêndio)                |
| Internet/Rede                | `calc/network.ts`      | `none` (baixa tensão, sem risco estrutural/elétrico) |
| Energia solar (fotovoltaica) | `calc/solar.ts`        | `required` (conexão à rede elétrica)                 |
| Aquecimento solar            | `calc/solarHeating.ts` | `recommended`                                        |

### Hidráulica (`calc/hydraulic.ts`) — Estimada

```
pipeMetersEstimate = points * metersPerPoint        // padrão: 3 m/ponto
connectionsEstimate = points * connectionsPerPoint   // padrão: 4 conexões/ponto
```

Não substitui projeto hidráulico (traçado real, diâmetros, perda de carga).

### Elétrica (`calc/electrical.ts`) — Estimada

```
outletsEstimate = rooms * outletsPerRoom      // padrão: 4 tomadas/cômodo
switchesEstimate = rooms                       // 1 ponto de comando/cômodo (mínimo)
cableMetersEstimate = (outletsEstimate + switchesEstimate) * 5
circuitsEstimate = ceil((outletsEstimate + switchesEstimate) / 6)
```

Não é dimensionamento elétrico normativo (NBR 5410) — todo projeto elétrico
final deve ser validado por eletricista/profissional habilitado.

### Internet/Rede (`calc/network.ts`) — Estimada

```
cableMetersEstimate = points * metersPerPoint   // padrão: 15 m/ponto até o rack
connectorsEstimate = points * 2                  // RJ45 nas duas pontas
patchCordsEstimate = points
```

### Aquecimento solar (`calc/solarHeating.ts`) — Estimada

```
reservoirLiters = occupants * litersPerPerson        // padrão: 60 L/pessoa/dia
collectorsCount = max(1, ceil(reservoirLiters / 75 / collectorAreaM2PerUnit))
collectorAreaM2 = collectorsCount * collectorAreaM2PerUnit
```

Referência de mercado: ~1 m² de coletor para cada 75 L de reservatório.
Dimensionamento final depende de instalador credenciado, orientação do
telhado e clima local (`SafetyNotice` `recommended`).

### Solar fotovoltaica (`calc/solar.ts`) — Estimada, fórmula documentada

```
dailyConsumptionKwh = monthlyConsumptionKwh / 30
systemSizeKwp = dailyConsumptionKwh / (peakSunHours * performanceRatio)
panelsCount = ceil(systemSizeKwp * 1000 / panelWattage)
requiredAreaM2 = panelsCount * panelAreaM2
estimatedMonthlyGenerationKwh = systemSizeKwp * peakSunHours * performanceRatio * 30
paybackMonths = systemCost / max(monthlySavingsReais, 0.01)
```

`peakSunHours` (horas de sol pico, HSP) é **parâmetro obrigatório do
usuário** (varia por região/orientação) — a V1 não embute uma tabela de
irradiação por cidade (isso é um `service` futuro, ver ARCHITECTURE.md §8);
por padrão sugerimos 4.5 HSP como valor médio brasileiro conservador,
mas sempre visível e editável. `performanceRatio` default 0.75 (perdas
típicas de sistema).

---

## 9. Mão de obra (`calc/labor.ts`) — Exata (dado o input do usuário)

```
dailyCost(workers, dailyRate, days) = workers * dailyRate * days
contractCost(totalValue) = totalValue
mixedCost(assignments) = sum(dailyCost ou contractCost por assignment)
diyCost() = 0   // custo monetário; tempo estimado é campo separado, não custo
```

---

## 10. Custo total e comparação (`calc/budget.ts`, `calc/compare.ts`) — Exata

```
stageTotal(stage) = materialsCost(stage) + laborCost(stage)
projectTotal(project) = sum(stageTotal) + tools + other + contingency
costPerSquareMeter(project) = projectTotal(project) / project.dimensions.area
compareMethods(methodA, methodB, baseCostPerM2, area) = {
  totalA, totalB, diffAbs: totalB - totalA, diffPercent: (totalB-totalA)/totalA*100
}
```

`contingency` (reserva de contingência) é percentual configurável
(default 10%, seguindo prática usual de orçamento de obra), aplicado sobre
materiais + mão de obra.

---

## 11. Tratamento de erros (regra geral, `domain/validation.ts`)

Toda função pública do motor de cálculo valida entradas com
`assertPositiveNumber`, `assertNonNegativeNumber` e `assertInRange` antes de
calcular. Em caso de entrada inválida (vazio, texto, negativo, zero onde não
faz sentido, valor absurdamente grande — ex. área > 1.000.000 m²), lança
`CalculationInputError(fieldKey, reasonKey)` — a UI captura e mostra uma
mensagem traduzida amigável, nunca deixa a tela quebrar (`ErrorBoundary` +
validação de formulário antes do submit).

## 12. Precisão e apresentação

- Cálculos internos: `number` (double), sem arredondamento.
- Apresentação: `formatCurrency`, `formatQuantity(value, unit, decimals)` em
  `utils/format.ts` — arredondam **apenas para exibição**, nunca alteram o
  valor armazenado.
- Todo resultado exibido na UI que depende de premissa (traço, rendimento,
  perda, HSP etc.) mostra um selo "Estimativa" com tooltip explicando a
  premissa usada e um link para editá-la.
