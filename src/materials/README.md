# `src/materials/`

Reservado para lógica dedicada de catálogo de materiais e lista de compras,
caso essa área cresça o suficiente para justificar sua própria pasta.

Na V1, o catálogo de materiais/preços vive em `src/domain/pricing/catalog.ts`
(dados + `resolveMaterialPrice`) e a tela de lista de compras é
`src/pages/MaterialsPage.tsx`. Essa divisão foi suficiente para o escopo
atual. Esta pasta existe desde já na arquitetura (ver
`docs/ARCHITECTURE.md` §4) como ponto de extensão natural — por exemplo, se
a V2 adicionar filtros avançados, favoritos de fornecedor ou importação de
listas de compras de terceiros, esse código dedicado pode viver aqui em vez
de inchar `MaterialsPage.tsx`.
