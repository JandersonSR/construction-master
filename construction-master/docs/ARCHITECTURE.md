# Arquitetura — Construction Master

## 0. Contexto da auditoria (Fase 0)

O repositório estava vazio (greenfield). Não havia código, dependências ou
configuração prévia para reaproveitar. Esta seção documenta as decisões de
stack e as restrições do ambiente de desenvolvimento em que a V1 foi escrita.

**Restrição de ambiente observada:** a sessão de build usada para gerar a V1
rodava em um sandbox cujo firewall de saída só permite `github.com`,
`codeload.github.com` e `objects.githubusercontent.com`. O registro do npm
(`registry.npmjs.org`), `pypi.org`, CDNs (`cdnjs`, `unpkg`, `jsdelivr`, `esm.sh`)
e registros alternativos estavam bloqueados (`403 host_not_allowed`). Isso
significa que **não foi possível rodar `npm install` dentro do sandbox de
build**. Para não comprometer a qualidade nem "mockar" a stack, a decisão foi:

1. Escrever o projeto real, completo, com o `package.json` e as dependências
   que fazem sentido em produção (Vite, React, Tailwind, Dexie, i18next,
   Playwright etc.) — exatamente como um projeto Node/React normal, pronto
   para `npm install` em qualquer máquina com internet (a do usuário, ou o
   GitHub Actions CI, que tem acesso total à internet).
2. Para a camada que **não depende de bundler/JSX** — o motor de cálculo, os
   modelos de domínio, a camada de preços e a lógica de storage — o código foi
   escrito em TypeScript puro e **efetivamente executado e testado** dentro do
   sandbox usando as ferramentas globais disponíveis (`tsx` + `node --test`),
   já que essas não dependem do registro do npm.
3. A camada de UI (React/JSX/Tailwind) foi escrita seguindo as mesmas
   convenções e não pôde ser buildada/renderizada dentro do sandbox de
   desenvolvimento (sem bundler disponível). Isso está registrado como
   limitação conhecida no README e deve ser validado com `npm install && npm
run dev` assim que o projeto for clonado em uma máquina com internet — o
   workflow de CI faz isso automaticamente a cada push/PR.

Essa decisão segue o princípio de autonomia do projeto: escolher a solução
mais simples, gratuita, open source, que facilite manutenção — sem travar o
projeto numa pergunta que o ambiente não tinha como responder.

## 1. Visão geral

Construction Master é uma aplicação **local-first**, **mobile-first**,
instalável como PWA, para planejamento, orçamento e execução de obras e
reformas residenciais. Não há backend na V1: tudo roda no navegador e os
dados ficam no dispositivo do usuário (IndexedDB), com exportação/importação
em JSON para backup manual.

## 2. Stack escolhida

| Camada              | Escolha                                                                                                                      | Motivo                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Linguagem           | TypeScript (strict)                                                                                                          | Segurança de tipos, essencial para cálculos financeiros/técnicos        |
| UI                  | React 18 (function components + hooks)                                                                                       | Ecossistema maduro, requisito explícito do briefing                     |
| Build tool          | Vite                                                                                                                         | Padrão atual para PWA + React, rápido, zero-config razoável             |
| Estilo              | Tailwind CSS                                                                                                                 | Design system utilitário, ótimo para mobile-first                       |
| Roteamento          | React Router                                                                                                                 | Padrão de mercado, suporta lazy loading por rota                        |
| Estado do domínio   | Context + hooks customizados (sem Redux)                                                                                     | Escopo da V1 não justifica uma lib de estado global; reduz dependências |
| Persistência local  | Dexie.js (wrapper de IndexedDB)                                                                                              | API ergonômica sobre IndexedDB, assíncrona, madura, MIT                 |
| Internacionalização | i18next + react-i18next                                                                                                      | Suporte robusto a namespaces, interpolação, plural, padrão de mercado   |
| Testes unitários    | Node.js test runner nativo (`node:test` + `node:assert`) via `tsx`, com camada de compatibilidade que também roda sob Vitest | Ver observação abaixo                                                   |
| Testes E2E          | Playwright                                                                                                                   | Requisito do briefing, já disponível/gratuito                           |
| Lint/format         | ESLint + Prettier                                                                                                            | Padrão de mercado                                                       |
| PWA                 | vite-plugin-pwa (Workbox)                                                                                                    | Gera manifest + service worker automaticamente                          |
| Hospedagem          | GitHub Pages (build estático)                                                                                                | Gratuito, sem servidor                                                  |

**Observação sobre testes:** o motor de cálculo (`src/domain/calc`) é escrito
sem nenhuma dependência de framework de teste específico: as suas suítes
usam `describe/it/expect`-like helpers que funcionam tanto com Vitest
(quando `npm install` foi rodado) quanto com o runner nativo do Node via
`tsx` (usado durante o desenvolvimento neste ambiente restrito, ver
`src/tests/test-helpers.ts`). Isso permitiu validar a matemática do sistema
de ponta a ponta mesmo sem acesso ao registro do npm.

## 3. Princípios de arquitetura

1. **UI não contém regra de negócio.** Componentes React apenas orquestram
   chamadas para `src/domain` (cálculos puros) e `src/storage` (persistência).
2. **Cálculos são funções puras.** Toda função em `src/domain/calc/*` recebe
   entradas explícitas e devolve saídas explícitas, sem I/O, sem estado
   global, sem `Date.now()` implícito. Isso as torna 100% testáveis e
   reaproveitáveis (ex.: futura Server-Side API, CLI, ou IA).
3. **Preços nunca são hardcoded na UI.** Todo preço vem do catálogo em
   `src/domain/pricing` (`defaultPriceCatalog`), que pode ser sobrescrito
   pelo usuário e persistido localmente.
4. **Textos nunca são hardcoded nos componentes.** Todo texto visível vem de
   `src/i18n/{pt-BR,en,es}/*.json` via `useTranslation()`.
5. **Extensibilidade por dados, não por código.** Novo método construtivo,
   nova etapa, novo material, novo vídeo = novo registro em um arquivo de
   dados (`src/construction/methods.ts`, `src/construction/stages.ts`,
   `src/materials/catalog.ts`, `src/videos/catalog.ts`), não uma mudança
   espalhada por dezenas de arquivos.
6. **Offline first.** Todas as telas essenciais (obra, orçamento,
   calculadoras, materiais, etapas) funcionam 100% sem internet. Apenas o
   player de vídeo (iframe do YouTube) exige rede.
7. **Segurança em primeiro lugar.** Todo módulo que toca em fundação,
   estrutura, elétrica de potência, gás, piscina/spa, ou dimensionamento
   normativo exibe um aviso de "estimativa, não substitui projeto técnico"
   (`SafetyNotice`), e a cópia nunca afirma que algo é "seguro" ou "aprovado".

## 4. Estrutura de pastas

```
src/
  app/          # bootstrap da aplicação, providers, rotas, layout raiz
  components/   # componentes de UI genéricos e reutilizáveis (design system)
  pages/        # telas/rotas (compõem features + components)
  features/     # lógica de UI de alto nível por funcionalidade (wizard de obra, etc.)
  calculators/  # UI da central de calculadoras (formulários que chamam src/domain/calc)
  construction/ # dados de métodos construtivos e etapas da obra
  materials/    # catálogo de materiais e lista de compras
  budget/       # orçamento consolidado, cenários, comparador de custos
  labor/        # cálculo de mão de obra (diária, empreitada, DIY, misto)
  projects/     # CRUD de "obras" (o projeto do usuário)
  tutorials/    # conteúdo educacional (artigos por etapa)
  videos/       # catálogo de vídeos e player
  i18n/         # arquivos de tradução pt-BR / en / es
  storage/      # camada Dexie (IndexedDB) + import/export JSON
  services/     # integrações externas (ex.: futura API de irradiação solar) — abstraídas
  domain/       # núcleo puro: types, calc engine, pricing, safety rules
  utils/        # helpers puros (formatação, validação, unidades)
  hooks/        # hooks React reutilizáveis
  types/        # tipos compartilhados de UI (quando não pertencem ao domain)
  tests/        # test helpers e testes de integração
```

## 5. Fluxo de dados

```
Usuário → Componente (pages/features) → hook (hooks/) → domain/calc (puro)
                                                    ↘ storage/ (Dexie) ↔ IndexedDB
```

Nenhum componente acessa `Dexie` diretamente: sempre passa por um repositório
em `src/storage/repositories/*`, que devolve/recebe tipos de `src/domain/types`.

## 6. Extensibilidade — como adicionar coisas novas

Ver `README.md`, seção "Como contribuir", para o passo a passo prático. Em
resumo, cada tipo de extensão é um novo objeto em um arquivo de dados:

- **Novo método construtivo:** adicionar entrada em `src/construction/methods.ts`.
- **Nova etapa da obra:** adicionar entrada em `src/construction/stages.ts`.
- **Novo material/preço:** adicionar entrada em `src/domain/pricing/catalog.ts`.
- **Nova calculadora:** criar função pura em `src/domain/calc/*` (com
  validação via `src/domain/validation.ts` e testes), exportar no índice
  `src/domain/calc/index.ts`, criar o formulário em `src/calculators/*.tsx`
  (seguindo o padrão de `CalculatorCard`/`NumberField`) e adicionar uma
  entrada nos arrays `CATEGORIES`/`CALCULATORS` de
  `src/pages/CalculatorsHubPage.tsx`, mais as chaves de i18n correspondentes
  em `src/i18n/{pt-BR,en,es}/calculators.json`.
- **Novo idioma:** duplicar `src/i18n/en/*.json`, traduzir, registrar em
  `src/i18n/index.ts`.
- **Novo vídeo:** adicionar entrada em `src/videos/catalog.ts`.

## 7. Segurança estrutural — regra de ouro

Nenhuma função do motor de cálculo produz uma recomendação estrutural
definitiva (ex.: "use sapata de 80x80cm"). O que o sistema faz:

- Estima quantidades de material a partir de dimensões **informadas pelo
  usuário** (não inferidas de carga/solo).
- Explica diferenças conceituais entre métodos/sistemas.
- Sempre anexa `SafetyNotice` nas telas de fundação, estrutura, elétrica,
  piscina/spa, telhado e energia solar, recomendando validação por
  profissional habilitado (engenheiro, arquiteto, eletricista, técnico).

## 8. Preparado para o futuro (v2+)

- **Backend/sincronização:** `src/storage` expõe uma interface
  `ProjectRepository` implementada hoje por `DexieProjectRepository`. Uma
  futura `ApiProjectRepository` pode implementar a mesma interface sem tocar
  na UI.
- **IA de planejamento:** o `domain/calc` já expõe funções puras
  (`buildProjectFromBrief`-ready) que uma futura camada de IA poderia chamar
  para transformar "quero uma casa de 150m²" em uma obra completa — a lógica
  de geração de etapas/materiais já existe e é reaproveitável.
- **Serviços externos:** qualquer chamada de rede (ex.: irradiação solar por
  CEP) deve passar por `src/services/*` com uma interface abstrata, permitindo
  trocar o provedor sem alterar a UI.

## 9. Limitações conhecidas da V1

Ver `docs/ROADMAP.md`, seção "Limitações conhecidas".
