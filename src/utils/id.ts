/**
 * Gerador de ID local — usa `crypto.randomUUID()` quando disponível (todos
 * os navegadores modernos) para evitar uma dependência externa só para
 * isso, com um fallback simples para ambientes sem essa API.
 */
export function nanoid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
