'use client';

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'focuslab:v1';

interface RecoveryScreenProps {
  rawText: string;
  onReset: () => void;
  onRetry: () => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  rawText,
  onReset,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard write fallback
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 space-y-4 bg-surface border-border shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-md border border-warn text-warn bg-surface-2">
            <span>⚠ Data Integrity Warning</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text">
            Storage Recovery Mode
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            FocusLab detected corrupted or unreadable data in your browser&apos;s local storage.
            To protect your records from loss, normal startup was halted.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="raw-corrupt-data" className="text-sm font-semibold text-text block">
            Raw Stored Text:
          </label>
          <textarea
            id="raw-corrupt-data"
            readOnly
            value={rawText}
            rows={5}
            className="w-full p-3 text-sm font-mono rounded border border-border bg-surface-2 text-text select-all focus:outline-accent"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            onClick={handleCopy}
            className="flex-1 min-h-[44px]"
          >
            {copied ? '✓ Copied to Clipboard' : 'Copy Raw Text'}
          </Button>

          <Button
            variant="secondary"
            onClick={onRetry}
            className="min-h-[44px]"
          >
            Retry Loading
          </Button>

          <Button
            variant="danger"
            onClick={onReset}
            className="min-h-[44px]"
          >
            Reset Storage
          </Button>
        </div>

        <p className="text-sm text-muted text-center pt-1">
          Tip: Copy your raw data before resetting so you have a manual backup.
        </p>
      </Card>
    </div>
  );
};

export const UIErrorFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-4 bg-surface border-border shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-md border border-warn text-warn bg-surface-2">
            <span>Application Notice</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text">
            Something went wrong
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            A visual rendering issue occurred in this view. Your stored focus data and logs remain safe.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onRetry}
          className="w-full min-h-[44px]"
        >
          Reload Page
        </Button>
      </Card>
    </div>
  );
};

interface BoundaryProps {
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FocusLab UI error boundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <UIErrorFallback onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

function isValidStoredState(raw: string): boolean {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;

    // Zustand persist stores: { state: { checks, sessions, activityLogs, experiments }, version: number }
    const state = (parsed as Record<string, unknown>).state;
    if (!state || typeof state !== 'object') return false;

    const s = state as Record<string, unknown>;
    if (!Array.isArray(s.checks)) return false;
    if (!Array.isArray(s.sessions)) return false;
    if (!Array.isArray(s.activityLogs)) return false;
    if (!Array.isArray(s.experiments)) return false;

    return true;
  } catch {
    return false;
  }
}

export const DataIntegrityGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [corruptData, setCorruptData] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && !isValidStoredState(raw)) {
        setCorruptData(raw);
      }
    } catch {
      /* Storage access blocked or restricted */
    }
  }, []);

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Ignored */
    }
    window.location.reload();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (corruptData !== null) {
    return (
      <RecoveryScreen
        rawText={corruptData}
        onReset={handleReset}
        onRetry={handleRetry}
      />
    );
  }

  return <AppErrorBoundary>{children}</AppErrorBoundary>;
};
