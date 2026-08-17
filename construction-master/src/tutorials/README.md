# `src/tutorials/`

Reservado para conteúdo educacional estruturado (artigos por etapa/tema),
além do que já existe no guia passo a passo.

Na V1, o conteúdo educacional por etapa (objetivo, passos, erros comuns,
dicas, checklist) vive nas chaves i18n `guides.*`
(`src/i18n/{pt-BR,en,es}/guides.json`) e é renderizado por
`src/pages/StageDetailPage.tsx`; o índice de etapas é
`src/pages/GuideIndexPage.tsx`. Esta pasta existe desde já na arquitetura
(ver `docs/ARCHITECTURE.md` §4) para o V2 (ver `docs/ROADMAP.md`), quando o
conteúdo passo a passo das 22 etapas restantes for expandido e/ou quando
artigos mais longos (ex.: "como escolher entre alvenaria e Steel Frame")
justificarem um formato próprio em vez de caber nas chaves de `guides.json`.
