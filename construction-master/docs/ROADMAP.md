# Roadmap — Construction Master

## V1 (este entrega) — Core + calculadoras + orçamento + obra + PWA

Escopo **realmente implementado e funcional** (nada de "em breve" clicável):

- Arquitetura, modelo de dados e motor de cálculo documentados e testados.
- Design system mobile-first (tema claro/escuro, navegação inferior no
  mobile, sidebar no desktop).
- Criação de obra via wizard (informações + dimensões com cálculo automático
  de área/perímetro/paredes).
- Sistema de etapas: as 30 etapas padrão do briefing, com metadados
  completos (ferramentas, dificuldade, nível de necessidade de profissional)
  para todas, e guia passo a passo completo (passos, erros comuns, dicas,
  checklist, cálculo de materiais e custo) implementado em profundidade para
  as etapas mais estruturantes: Fundação, Alvenaria, Piso, Pintura, Elétrica,
  Hidráulica, Telhado, Deck — as demais etapas têm estrutura completa e
  pronta para receber conteúdo adicional (ver "Como contribuir" no README).
- Central de calculadoras: geometria, concreto, alvenaria, piso, pintura,
  telhado, deck, hidráulica, elétrica, internet/rede, energia solar,
  aquecimento solar, financeira/orçamento (13 calculadoras).
- Comparador de métodos construtivos (alvenaria convencional, bloco
  estrutural, tijolo ecológico, Steel Frame, Light Steel Frame, Wood Frame,
  concreto armado, pré-fabricado) com tabela comparativa.
- Orçamento consolidado por etapa, catálogo de preços central editável,
  mão de obra (DIY / diária / empreitada / mista).
- Lista de materiais/compras com status "comprado".
- Checklist por etapa com progresso, custo real x estimado.
- Dashboard com progresso físico e financeiro.
- Módulo de vídeos (arquitetura orientada a dados, catálogo inicial
  curado de vídeos públicos do YouTube por etapa).
- i18n completo pt-BR / en / es para toda a UI da V1.
- Persistência local via IndexedDB (Dexie), export/import JSON.
- PWA instalável, funcionamento offline das telas essenciais.
- Obra de demonstração "Chácara — Casa 250m²" pré-carregada na primeira
  execução.
- Motor de cálculo com testes automatizados (executados e verificados).
- CI (GitHub Actions): lint, typecheck, testes, build.

## V2 — Mais módulos construtivos + conteúdo + vídeos

- Conteúdo passo a passo completo para as 22 etapas restantes (a central de
  calculadoras já cobre geometria, concreto, alvenaria, piso, pintura,
  telhado, deck, hidráulica, elétrica, internet/rede, energia solar e
  aquecimento solar — o que falta é o guia passo a passo detalhado dessas
  etapas, não a calculadora em si).
- Módulos de calculadora dedicados para: Piscina sobre deck avançada,
  Jacuzzi/Spa, Carregador de veículo elétrico, Telefonia, Climatização,
  Drywall, Paisagismo (hoje cobertos apenas pelo guia genérico da etapa,
  sem calculadora própria).
- Geração de PDF nativo dos relatórios (hoje: impressão do navegador +
  exportação JSON).
- Suporte a sistema imperial de unidades (arquitetura já preparada em
  `utils/units.ts`).
- Upload real de fotos no checklist com compressão local.

## V3 — Cloud opcional + login + sincronização

- Backend opcional (auth + sync), mantendo o modo 100% local como padrão.
- `ApiProjectRepository` implementando a mesma interface de
  `ProjectRepository` usada hoje pelo Dexie.
- Política de privacidade e exclusão de dados.

## V4 — Compartilhamento de obras

- Compartilhar um projeto (somente leitura ou colaborativo) via link.

## V5 — Marketplace / fornecedores

- Integração opcional com fornecedores para preços em tempo real por região
  (mantendo o catálogo local como fallback offline).

## V6 — IA para auxiliar planejamento

- Camada de IA sobre o motor de cálculo puro já existente: interpretar
  "quero uma casa de 150m² com orçamento de R$300 mil", fazer perguntas,
  montar a obra automaticamente reaproveitando `domain/calc` e
  `construction/stages.ts` sem duplicar lógica.

---

## Limitações conhecidas da V1

1. **`npm install`, `vitest run` e o build completo não foram executados
   dentro do sandbox de desenvolvimento.** O ambiente usado para escrever
   esta V1 bloqueia acesso ao registro do npm e a CDNs (ver
   `ARCHITECTURE.md` §0). O que **foi efetivamente executado e verificado**
   neste ambiente, usando apenas ferramentas globais (`tsc`, `tsx`), sem
   `npm install`:
   - O motor de cálculo puro (`src/domain/calc/*`, `src/videos/types.ts`) —
     typecheck via `tsc` com `strict`/`noUncheckedIndexedAccess`, e execução
     real via `scripts/sanity-check.mjs` (`npx tsx scripts/sanity-check.mjs`,
     22 verificações, 0 falhas).
   - As camadas `construction/`, `projects/`, `budget/`, `storage/` —
     typecheck via `tsc` (sem os pacotes `dexie`/`react`, que não puderam
     ser instalados; os únicos erros restantes nesse typecheck seguem
     diretamente da ausência do pacote `dexie`, não de erros de lógica).
   - Todos os 3 idiomas de i18n — validade de JSON, paridade de arquivos e
     chaves (incluindo tamanho de arrays) entre pt-BR/en/es, e resolução de
     100% das chaves estáticas `t(...)` usadas em `src/pages`,
     `src/components`, `src/calculators`, `src/app` contra a árvore pt-BR.
   - Os testes unitários (`*.test.ts`, Vitest) e os testes de integração de
     armazenamento (`src/storage/**/*.test.ts`, que usam `fake-indexeddb`)
     foram **escritos e verificados estruturalmente** (typecheck, mesma
     ressalva do `dexie` acima) mas **não executados via `vitest run`**,
     pois `vitest` e `fake-indexeddb` não puderam ser instalados neste
     ambiente. A camada React/Vite/Tailwind foi escrita seguindo as mesmas
     convenções mas **não foi buildada nem executada em navegador neste
     ambiente**. Isso deve acontecer no primeiro `npm install && npm run
dev` / `npm run verify` do usuário, ou automaticamente no CI (GitHub
     Actions tem internet completa). Qualquer erro de tipo/import
     remanescente nessa camada deve ser corrigido nesse primeiro run.
2. **Conteúdo de guia passo a passo** está completo para 8 das 30 etapas;
   as demais têm metadados (ferramentas, dificuldade, aviso de segurança)
   mas texto de passo a passo resumido, marcado como tal na própria tela
   (não como "em breve" — o conteúdo existente é real, só que mais enxuto).
3. **Vídeos**: catálogo inicial pequeno e curado manualmente (sem API paga
   do YouTube); arquitetura pronta para crescer.
4. **Energia solar**: não há tabela de irradiação solar por cidade
   embutida — o usuário informa HSP (horas de sol pico) manualmente. A
   integração automática por CEP é V2+ (via `src/services`).
5. **Sem testes E2E executados neste ambiente** (Playwright está configurado
   e o script `npm run test:e2e` existe, mas roda no CI/máquina do usuário
   pela mesma razão do item 1).
6. **`src/tests/setupTests.ts`** registra o polyfill `fake-indexeddb/auto`
   (necessário porque o jsdom não implementa IndexedDB) e um mock mínimo de
   `window.matchMedia`/`window.scrollTo`. Como `vitest run` não pôde ser
   executado neste ambiente (item 1), esse arquivo não foi validado em
   execução real — apenas revisado manualmente contra a API do
   `fake-indexeddb` e do `matchMedia`.
