# `src/services/`

Reservado para integrações externas futuras (V2+), sempre abstraídas atrás
de uma interface própria — nunca chamadas diretamente da UI.

A V1 é **100% local-first e não depende de nenhum serviço externo pago ou
obrigatório**. Esta pasta existe desde já na arquitetura (ver
`docs/ARCHITECTURE.md` §4 e `docs/ROADMAP.md`) para receber, quando fizerem
sentido:

- uma futura API de irradiação solar por localização/CEP (hoje o usuário
  informa manualmente as horas de sol pico — HSP — na calculadora solar);
- uma futura `ApiProjectRepository` (V3+) para sincronização em nuvem
  opcional, implementando a mesma interface `ProjectRepository` de
  `src/storage/repositories/projectRepository.ts` — trocável sem alterar
  nenhuma tela.

Qualquer serviço adicionado aqui deve continuar opcional: o app precisa
seguir funcionando 100% offline sem ele.
