# Changelog

Este projeto segue, de forma informal, o espírito do
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e do
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.1.0] — V1 (não lançado)

Primeira versão pública do Construction Master: sistema local-first,
mobile-first e PWA de planejamento, cálculo, orçamento e aprendizado de
construção civil. Ver `docs/ROADMAP.md` para o escopo completo e as
limitações conhecidas desta versão.

### Adicionado

- Arquitetura, modelo de dados e motor de cálculo puro documentados
  (`docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/CALCULATION_ENGINE.md`).
- Design system mobile-first com tema claro/escuro/automático, navegação
  inferior no mobile e sidebar no desktop.
- Wizard de criação de obra (informações, dimensões com cálculo automático
  de área/perímetro/parede, método construtivo, revisão).
- Sistema de 30 etapas de obra com metadados completos e guia passo a passo
  aprofundado para 8 etapas estruturantes.
- Central de calculadoras com 13 calculadoras: geometria, concreto,
  alvenaria, piso, pintura, telhado, deck (com estimativa de carga de
  piscina sobre deck), hidráulica, elétrica, internet/rede, energia solar
  fotovoltaica, aquecimento solar e financeira/orçamento.
- Comparador de métodos construtivos (8 métodos).
- Orçamento consolidado por etapa com catálogo de preços central editável
  (overrides globais e por obra) e 4 modos de mão de obra (DIY, diária,
  empreitada, mista).
- Lista de materiais/compras com status de compra.
- Checklist por etapa com progresso e custo real x estimado.
- Dashboard de progresso físico e financeiro.
- Módulo de vídeos educativos (catálogo curado de vídeos públicos do
  YouTube, sem uso de API paga).
- i18n completo pt-BR / en / es para toda a interface.
- Persistência local via IndexedDB (Dexie), com export/import de backup em
  JSON.
- PWA instalável com funcionamento offline das telas essenciais.
- Obra de demonstração "Chácara — Casa 250m²" pré-carregada na primeira
  execução.
- Testes automatizados do motor de cálculo e testes de integração da
  camada de armazenamento (Vitest).
- CI via GitHub Actions (lint, typecheck, testes, build).
