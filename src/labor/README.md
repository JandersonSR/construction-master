# `src/labor/`

Reservado para lógica dedicada de mão de obra, caso essa área cresça além
das funções puras atuais.

Na V1, o cálculo de custo de mão de obra (DIY / diária / empreitada / mista)
é uma função pura em `src/domain/calc/labor.ts` (ver
`docs/CALCULATION_ENGINE.md` §9), e a UI de configuração de mão de obra por
etapa vive em `src/pages/StageDetailPage.tsx` e `src/pages/BudgetPage.tsx`.
Esta pasta existe desde já na arquitetura (ver `docs/ARCHITECTURE.md` §4)
como ponto de extensão — por exemplo, se a V2 adicionar um cadastro de
equipes/profissionais reutilizável entre etapas, esse código pode viver
aqui.
