import type { VideoDefinition } from './types';

/**
 * Catálogo curado de vídeos públicos do YouTube (nenhum vídeo hospedado
 * pelo próprio app, nenhuma API paga). Cada vídeo foi localizado por busca
 * pública em agosto de 2026 e associado à etapa correspondente da obra.
 *
 * Para adicionar um vídeo novo: adicione um objeto aqui com a URL pública
 * do YouTube — nenhuma outra parte do sistema precisa mudar.
 */
export const videoCatalog: VideoDefinition[] = [
  {
    id: 'planning-basics',
    title: 'Como construir uma casa passo a passo',
    description:
      'Visão geral do processo de construção de uma casa, do planejamento à entrega.',
    url: 'https://www.youtube.com/watch?v=zLZ6jCOYK_k',
    language: 'pt-BR',
    categoryKey: 'videos.categories.planning',
    stageId: 'planning',
  },
  {
    id: 'foundation-basics',
    title: 'Como Fazer a Fundação de Uma Casa do Jeito Certo! Passo a Passo',
    description: 'Explicação prática sobre execução de fundação residencial.',
    url: 'https://www.youtube.com/watch?v=WOz6PPnJSs4',
    language: 'pt-BR',
    categoryKey: 'videos.categories.foundation',
    stageId: 'foundation',
  },
  {
    id: 'masonry-basics',
    title: 'Como fazer uma alvenaria 100% no prumo, no nível e na régua',
    description: 'Técnica de assentamento de alvenaria com prumo e nível.',
    url: 'https://www.youtube.com/watch?v=oOWPgFBTeyY',
    language: 'pt-BR',
    categoryKey: 'videos.categories.masonry',
    stageId: 'masonry',
  },
  {
    id: 'hydraulic-basics',
    title: 'Instalação hidráulica de banheiro passo a passo',
    description: 'Tutorial prático de instalação hidráulica residencial.',
    url: 'https://www.youtube.com/watch?v=O5IMBrOqAYs',
    language: 'pt-BR',
    categoryKey: 'videos.categories.hydraulic',
    stageId: 'hydraulic',
  },
  {
    id: 'electrical-basics',
    title: 'Instalação elétrica residencial básica (para iniciantes)',
    description:
      'Introdução à instalação elétrica residencial — sempre valide com um eletricista habilitado.',
    url: 'https://www.youtube.com/watch?v=nmGCsq-ahdM',
    language: 'pt-BR',
    categoryKey: 'videos.categories.electrical',
    stageId: 'electrical',
  },
  {
    id: 'roofing-basics',
    title: 'Como fazer telhado passo a passo',
    description: 'Montagem de estrutura e telhas passo a passo.',
    url: 'https://www.youtube.com/watch?v=-ExD-rsSCCs',
    language: 'pt-BR',
    categoryKey: 'videos.categories.roofing',
    stageId: 'roofing',
  },
  {
    id: 'flooring-basics',
    title: 'Como assentar piso de porcelanato de forma simples e fácil (passo a passo)',
    description: 'Tutorial de assentamento de porcelanato.',
    url: 'https://www.youtube.com/watch?v=N63IYBuWJVs',
    language: 'pt-BR',
    categoryKey: 'videos.categories.flooring',
    stageId: 'flooring',
  },
  {
    id: 'painting-basics',
    title: 'Como pintar uma parede — aula rápida com pintor profissional',
    description: 'Passo a passo de pintura residencial com um profissional.',
    url: 'https://www.youtube.com/watch?v=PXyjRRLKl9o',
    language: 'pt-BR',
    categoryKey: 'videos.categories.painting',
    stageId: 'painting',
  },
  {
    id: 'deck-basics',
    title: 'Como instalar deck de madeira (passo a passo)',
    description: 'Tutorial de montagem de deck de madeira.',
    url: 'https://www.youtube.com/watch?v=tEd1XFZns8Q',
    language: 'pt-BR',
    categoryKey: 'videos.categories.deck',
    stageId: 'deck',
  },
];

export function findVideo(id: string): VideoDefinition | undefined {
  return videoCatalog.find((v) => v.id === id);
}

export function getVideosForStage(stageId: string): VideoDefinition[] {
  return videoCatalog.filter((v) => v.stageId === stageId);
}
