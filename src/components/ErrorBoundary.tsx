import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Ghair mutawaqqe kharabi (Unexpected error)',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      try {
        window.history.pushState({}, '', '/');
        window.location.href = '/';
      } catch {
        window.location.reload();
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-serif text-amber-300">
                {this.props.fallbackTitle || 'Takneeki Kharabi (Technical Issue)'}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Page load hone mein mamooli kharabi aayi hai. Aap neechay diye gaye button par click kar ke foran public website par wapis ja sakte hain:
              </p>
            </div>

            {this.state.errorMessage && (
              <div className="text-[11px] font-mono text-stone-400 bg-stone-900 p-2.5 rounded-xl border border-stone-800 text-left overflow-auto max-h-24">
                {this.state.errorMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Public Website Par Wapis Jayein</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Page Dobara Refresh Karein</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
