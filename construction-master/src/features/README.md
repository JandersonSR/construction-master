# `src/features/`

Reservado para lógica de UI de alto nível que combine múltiplos componentes
em um fluxo específico (ex.: um futuro wizard multi-etapa mais complexo do
que o de criação de obra, ou um fluxo de onboarding dedicado).

Na V1, os fluxos existentes (wizard de nova obra, etapas, calculadoras,
orçamento) foram simples o suficiente para viver diretamente em
`src/pages/*.tsx`, sem precisar de uma camada extra de `features/`. Esta
pasta existe desde já na arquitetura (ver `docs/ARCHITECTURE.md` §4) para
que fluxos futuros mais complexos tenham um lugar natural, sem exigir
refatoração da estrutura de pastas.
