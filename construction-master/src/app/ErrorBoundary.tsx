import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Boundary de erro de última instância. O motor de cálculo já valida
 * entradas (ver `domain/validation.ts`), então este boundary existe para
 * capturar qualquer falha inesperada de renderização sem derrubar o app
 * inteiro — o usuário nunca deve ver uma tela branca.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Construction Master — erro não tratado:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="text-4xl" aria-hidden="true">
            ⚠️
          </span>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Algo deu errado nesta tela.
          </h1>
          <p className="max-w-sm text-sm text-slate-600 dark:text-slate-300">
            Seus dados estão salvos localmente e não foram perdidos. Tente recarregar a
            página.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
