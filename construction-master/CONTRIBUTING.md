# Como contribuir

Obrigado por considerar contribuir com o Construction Master! Este é um
projeto open source, gratuito, sem serviços pagos obrigatórios. Qualquer
contribuição — código, tradução, conteúdo de guia, revisão técnica de
segurança — é bem-vinda.

## Princípios do projeto (leia antes de contribuir)

1. **Segurança em primeiro lugar.** Nenhuma calculadora ou guia deve
   afirmar que algo é "seguro" ou substituir projeto técnico assinado por
   profissional habilitado (engenheiro, eletricista, encanador etc.),
   especialmente em fundação, estrutura, elétrica, gás, piscina/spa e
   energia solar. Use o componente `SafetyNotice` (`src/components/ui/SafetyNotice.tsx`)
   sempre que a tela tocar nesses temas.
2. **Sem preço/texto/número mágico espalhado pelo código.** Preços vivem em
   `src/domain/pricing/catalog.ts`. Texto de UI vive em `src/i18n/*`. Nunca
   escreva um preço ou uma string de interface diretamente dentro de um
   componente.
3. **O motor de cálculo é puro.** Funções em `src/domain/calc/*` não podem
   ter efeitos colaterais, não podem arredondar valores intermediários (só
   o resultado final para exibição — ver `docs/CALCULATION_ENGINE.md` §12),
   e devem validar as entradas com `src/domain/validation.ts`, lançando
   `CalculationInputError` em vez de deixar `NaN`/`Infinity` vazar.
4. **Sem "em breve" clicável.** Se uma funcionalidade não está pronta,
   documente no roadmap (`docs/ROADMAP.md`) em vez de adicionar um botão
   desabilitado ou um link morto na V1.
5. **Extensibilidade por dado, não por código.** Métodos construtivos,
   etapas, materiais/preços e vídeos são arrays de objetos tipados. Adicionar
   um novo item deve significar editar um arquivo de dados, não espalhar
   `if`s pela UI.

## Rodando o projeto localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run test      # Vitest
npm run lint       # ESLint
npm run typecheck  # tsc -b --noEmit
npm run build      # build de produção
npm run verify      # lint + typecheck + test + build, nessa ordem
```

## Como adicionar coisas novas

### Uma nova calculadora

1. Crie a função pura em `src/domain/calc/<nome>.ts`, validando as entradas
   com `src/domain/validation.ts` (`assertPositiveNumber`,
   `assertNonNegativeNumber`, `assertInRange`, `assertPositiveInteger`).
   Nunca arredonde valores intermediários.
2. Exporte a função em `src/domain/calc/index.ts` (`export * from './<nome>'`).
3. Escreva testes em `src/domain/calc/<nome>.test.ts` (Vitest) cobrindo o
   caso feliz, os valores padrão e pelo menos um caso de entrada inválida.
4. Crie o formulário em `src/calculators/<Nome>Calculator.tsx`, seguindo o
   padrão de `CalculatorCard`/`ResultRow`/`NumberField` (veja
   `src/calculators/GeometryCalculator.tsx` como referência). Adicione
   `<SafetyNotice level="..." />` se o tema exigir (elétrica, gás, piscina,
   estrutura, energia solar).
5. Adicione a calculadora ao array `CATEGORIES` e ao objeto `CALCULATORS`
   em `src/pages/CalculatorsHubPage.tsx`.
6. Adicione as chaves de i18n em `src/i18n/{pt-BR,en,es}/calculators.json`
   (incluindo o rótulo em `hub.categories`), nas 3 línguas.
7. Documente a fórmula em `docs/CALCULATION_ENGINE.md`, classificando-a como
   Exata, Estimada ou Aproximada.

### Um novo método construtivo

Adicione uma entrada ao array `constructionMethods` em
`src/construction/methods.ts`, com as chaves de i18n correspondentes em
`src/i18n/{pt-BR,en,es}/methods.json`.

### Uma nova etapa de obra

Adicione uma entrada ao array `stageDefinitions` em
`src/construction/stages.ts` e o conteúdo do guia (objetivo, passos, erros
comuns, dicas, checklist) em `src/i18n/{pt-BR,en,es}/guides.json`, nas 3
línguas, com o mesmo número de itens em cada array.

### Um novo material/preço

Adicione uma entrada ao array `defaultPriceCatalog` em
`src/domain/pricing/catalog.ts`. Preços são apenas sugestões editáveis pelo
usuário (`priceRepository`/`PriceOverride`) — nunca hardcode um preço em
outro lugar do código.

### Um novo vídeo

Adicione uma entrada ao array em `src/videos/catalog.ts`, com `language`
correto e, se aplicável, `stageId` apontando para a etapa relacionada.
Prefira vídeos públicos, sem necessidade de chave de API paga.

### Um novo idioma

1. Duplique todos os arquivos de `src/i18n/en/*.json` para
   `src/i18n/<código>/*.json` e traduza.
2. Garanta que cada arquivo tenha exatamente as mesmas chaves (e o mesmo
   tamanho de arrays) que a versão em pt-BR — isso é verificado
   manualmente hoje; um script de verificação de paridade está descrito em
   `docs/ARCHITECTURE.md`.
3. Registre o novo idioma em `SUPPORTED_LANGUAGES`, em `src/i18n/index.ts`.

## Convenção de chaves de i18n

Este projeto usa **um único namespace `translation` por idioma** (todos os
arquivos JSON de um idioma são mesclados em `src/i18n/<lang>/index.ts`).
Chamadas de tradução usam caminho com ponto, nunca a sintaxe de namespace
com dois-pontos:

```tsx
// Correto:
t('common.safetyNotice.title');

// Errado (não funciona com esta configuração):
t('common:safetyNotice.title');
```

**Nunca crie uma chave JSON com um ponto literal no nome** (ex.:
`"type.house": "Casa"` como irmã de `"type": "Tipo"`) — o i18next trata
todo ponto na chave de busca como um limite de aninhamento, então
`t('...type.house')` nunca encontraria essa chave (ele para em `type`,
que já resolve para a string `"Tipo"`). Use um objeto aninhado dedicado em
vez disso (ex.: `"typeOptions": { "house": "Casa" }`).

## Pull requests

- Rode `npm run verify` antes de abrir o PR.
- Descreva o que mudou e por quê.
- Se adicionar conteúdo em pt-BR, tente também adicionar em en/es (ou avise
  no PR que a tradução está pendente).
