import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Evita que un error de renderizado deje la app en blanco
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error de renderizado capturado:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full text-center">
            <div className="text-5xl font-black text-brand-primary mb-4">¡Ups!</div>
            <p className="text-slate-600 mb-2">
              Algo salió mal al mostrar esta página. Intenta recargar la tienda.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}