# `src/types/`

Reservado para tipos compartilhados de UI que não pertencem ao domínio puro
(`src/domain/types/`) — por exemplo, props compartilhadas entre componentes,
ou tipos de estado de formulário que não fazem sentido dentro do domínio.

Na V1, todo tipo com significado de negócio (obra, etapa, material, método
construtivo, orçamento) vive em `src/domain/types/`, e os componentes que
precisam de tipos extras os declaram localmente (ex.: `interface LineEntry`
em `src/pages/MaterialsPage.tsx`). Esta pasta existe desde já na arquitetura
(ver `docs/ARCHITECTURE.md` §4) para quando esses tipos locais começarem a
se repetir entre telas o suficiente para valer a pena centralizá-los aqui.
