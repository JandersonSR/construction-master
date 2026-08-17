# 🏗️ Construction Master

Sistema **gratuito, open source e local-first** para planejar, calcular,
orçar, aprender e acompanhar a execução de uma obra ou reforma residencial
— pensado para quem não é engenheiro nem arquiteto, mas também útil para
profissionais.

Mobile-first, PWA (instalável, funciona offline), sem conta obrigatória, sem
serviço pago obrigatório, sem anúncios.

> ⚠️ **Este projeto não substitui um projeto técnico assinado por
> profissional habilitado.** Todas as calculadoras e guias são ferramentas
> de planejamento e estimativa. Fundação, estrutura, elétrica, gás,
> piscina/spa e energia solar **exigem avaliação de um profissional
> habilitado** antes da execução — o app deixa isso explícito em cada tela
> relevante (`SafetyNotice`), e nunca afirma que algo é "seguro" ou
> "aprovado".

## O que o app faz

- **Wizard de criação de obra**: informações, dimensões (com cálculo
  automático de área/perímetro/parede), método construtivo, revisão.
- **30 etapas de obra** com metadados (ferramentas, dificuldade, nível de
  necessidade de profissional) e guia passo a passo (passos, erros comuns,
  dicas, checklist, cálculo de materiais/custo) — aprofundado para as
  etapas mais estruturantes na V1.
- **13 calculadoras**: geometria, concreto, alvenaria, piso, pintura,
  telhado, deck (com estimativa de carga de piscina sobre deck), hidráulica,
  elétrica, internet/rede, energia solar fotovoltaica, aquecimento solar e
  financeira/orçamento.
- **Comparador de métodos construtivos** (alvenaria convencional, bloco
  estrutural, tijolo ecológico, Steel Frame, Light Steel Frame, Wood Frame,
  concreto armado, pré-fabricado).
- **Orçamento consolidado** por etapa, com catálogo de preços central
  totalmente editável (nunca preços fixos escondidos no código) e 4 modos
  de mão de obra (DIY, diária, empreitada, mista).
- **Lista de materiais/compras** com status de compra, **checklist** por
  etapa com progresso e custo real x estimado, e **dashboard** de progresso
  físico e financeiro.
- **Vídeos educativos**: catálogo curado de vídeos públicos do YouTube por
  etapa (sem API paga, sem vídeo hospedado pelo projeto).
- **i18n completo**: pt-BR, en, es — sem texto de interface hardcoded.
- **100% local-first**: os dados ficam no seu navegador (IndexedDB), com
  export/import de backup em JSON. Nenhuma conta é necessária.
- **PWA instalável**, com funcionamento offline das telas essenciais.
- **Obra de demonstração** ("Chácara — Casa 250m²") pré-carregada na
  primeira execução, para você explorar o app com dados realistas.

Veja o escopo completo, o que ainda não está pronto e o plano para as
próximas versões em [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack técnica

React 18 + TypeScript (strict) + Vite + Tailwind CSS + React Router
(`HashRouter`, para funcionar em hospedagem estática sem configurar
rewrites) + Dexie.js (IndexedDB) + i18next + Vitest + Playwright + ESLint +
Prettier + `vite-plugin-pwa`.

Sem backend, sem banco de dados hospedado, sem serviço pago obrigatório.
Arquitetura documentada em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
incluindo uma seção transparente (§0) sobre as restrições do ambiente em
que esta V1 foi originalmente escrita e o que foi efetivamente testado
nesse ambiente.

## Rodando localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 18.18+ e npm.

```bash
git clone <url-do-seu-fork-ou-repo>
cd construction-master
npm install
npm run dev
```

Abra `http://localhost:5173`. A obra de demonstração é criada
automaticamente na primeira execução.

### Scripts disponíveis

| Comando                           | O que faz                                             |
| --------------------------------- | ----------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento (Vite)                    |
| `npm run build`                   | Build de produção (`tsc -b && vite build`) em `dist/` |
| `npm run preview`                 | Serve o build de produção localmente                  |
| `npm run lint`                    | ESLint                                                |
| `npm run format` / `format:check` | Prettier                                              |
| `npm run typecheck`               | `tsc -b --noEmit`                                     |
| `npm run test`                    | Testes unitários e de integração (Vitest)             |
| `npm run test:watch`              | Vitest em modo watch                                  |
| `npm run test:e2e`                | Testes end-to-end (Playwright)                        |
| `npm run verify`                  | `lint && typecheck && test && build`, nessa ordem     |

## Deploy no GitHub Pages

O repositório já inclui dois workflows do GitHub Actions em
`.github/workflows/`:

- **`ci.yml`**: roda lint, typecheck, testes e build em todo push/PR para
  `main`.
- **`deploy.yml`**: builda e publica `dist/` no GitHub Pages a cada push em
  `main`, usando as actions oficiais do GitHub (`upload-pages-artifact` +
  `deploy-pages`) — sem serviço de terceiros.

Para ativar:

1. No repositório no GitHub, vá em **Settings → Pages** e, em "Build and
   deployment", selecione **Source: GitHub Actions**.
2. Faça um push para `main` (ou rode o workflow `Deploy to GitHub Pages`
   manualmente em **Actions**).
3. A URL final aparece no resumo do job `deploy` e em **Settings → Pages**
   (formato `https://<usuário>.github.io/<repositório>/`).

O app usa `base: './'` no `vite.config.ts` e `HashRouter` no roteamento —
isso significa que o build funciona em **qualquer subcaminho**, sem
precisar saber o nome do repositório de antemão e sem precisar configurar
rewrites de servidor (necessário em hospedagem 100% estática).

Qualquer outra hospedagem de arquivos estáticos gratuita (Netlify, Vercel,
Cloudflare Pages, GitLab Pages etc.) também funciona: basta apontar para a
pasta `dist/` gerada por `npm run build`.

## Instalando como PWA

Depois de abrir o app hospedado (ou `npm run preview` localmente) em um
navegador compatível:

- **Android (Chrome)**: menu ⋮ → "Instalar app" ou "Adicionar à tela
  inicial".
- **iOS (Safari)**: botão de compartilhar → "Adicionar à Tela de Início".
- **Desktop (Chrome/Edge)**: ícone de instalação na barra de endereço, ou
  menu → "Instalar Construction Master".

Uma vez instalado, o app abre em janela própria e as telas essenciais
funcionam offline (o service worker é gerado por `vite-plugin-pwa`; vídeos
do YouTube exigem rede, já que não são hospedados pelo projeto).

## Arquitetura, dados e contribuição

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — visão geral, stack,
  estrutura de pastas, fluxo de dados, regra de ouro de segurança
  estrutural.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — modelo de dados completo
  (obra, etapas, materiais, orçamento) e formato de backup.
- [`docs/CALCULATION_ENGINE.md`](docs/CALCULATION_ENGINE.md) — cada fórmula
  usada pelas calculadoras, classificada como Exata/Estimada/Aproximada,
  mais as regras de tratamento de erro e arredondamento.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — o que está na V1, o que vem a
  seguir (V2–V6) e as limitações conhecidas desta versão.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — como rodar, testar e contribuir;
  passo a passo para adicionar uma calculadora, método construtivo, etapa,
  material, vídeo ou idioma novo.

## Privacidade

Nenhuma conta é necessária. Todos os dados (obras, preços, configurações)
ficam apenas no armazenamento local do seu navegador (IndexedDB). Nada é
enviado para nenhum servidor. Use "Configurações → Exportar backup" para
salvar seus dados em um arquivo `.json` e "Importar backup" para restaurar
em outro dispositivo/navegador.

## Licença

[MIT](LICENSE).
