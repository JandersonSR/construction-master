export interface VideoDefinition {
  id: string;
  title: string;
  description?: string;
  /** URL do vídeo no YouTube (link público, sem uso de API paga) */
  url: string;
  /** idioma do conteúdo do vídeo em si — pode ser diferente do idioma da interface */
  language: 'pt-BR' | 'en' | 'es';
  categoryKey: string;
  stageId?: string;
}

/**
 * Extrai o ID do vídeo do YouTube a partir de formatos comuns de URL:
 * watch?v=ID, youtu.be/ID, /embed/ID e /shorts/ID. Retorna null se nenhum
 * padrão reconhecido for encontrado (nunca lança exceção).
 */
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /\/(?:embed|shorts)\/([^?&/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
