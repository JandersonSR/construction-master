/**
 * Setup global do Vitest (jsdom). Referenciado por `vite.config.ts` em
 * `test.setupFiles`. Roda antes de cada arquivo de teste.
 */
import '@testing-library/jest-dom/vitest';

// jsdom não implementa IndexedDB — os testes de integração de
// `src/storage/*` (Dexie) dependem deste polyfill em memória. Precisa ser
// importado antes de qualquer módulo que crie uma instância de `Dexie`.
import 'fake-indexeddb/auto';

// jsdom não implementa `window.matchMedia` — usado por `useTheme()` para
// detectar o tema claro/escuro do sistema operacional.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom não implementa scrollTo — alguns componentes de navegação chamam
// isso ao trocar de rota.
if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = () => undefined;
}
