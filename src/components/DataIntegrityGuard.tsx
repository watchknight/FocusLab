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
      // Fallback
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 space-y-4 bg-surface border-border shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-warn text-warn bg-surface-2">
            <span>⚠ Data Integrity Warning</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text">
            Storage Recovery Mode
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            FocusLab detected corrupted or invalid JSON in your browser&apos;s local storage.
            To protect your records from loss, we halted normal startup.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="raw-corrupt-data" className="text-xs font-semibold text-text block">
            Raw Stored Text:
          </label>
          <textarea
            id="raw-corrupt-data"
            readOnly
            value={rawText}
            rows={5}
            className="w-full p-2.5 text-xs font-mono rounded border border-border bg-surface-2 text-text select-all focus:outline-accent"
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

        <p className="text-[11px] text-muted text-center pt-1">
          Tip: Copy your raw data before resetting so you have a manual backup.
        </p>
      </Card>
    </div>
  );
};

interface BoundaryProps {
  children: ReactNode;
  fallback: (error: Error, rawText: string) => ReactNode;
}

interface BoundaryState {
  hasError: boolean;
  error: Error | null;
  rawText: string;
}

class IntegrityErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, rawText: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    let raw = '';
    try {
      raw = localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      /* Ignored */
    }
    return { hasError: true, error, rawText: raw };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FocusLab integrity boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.state.rawText);
    }
    return this.props.children;
  }
}

export const DataIntegrityGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [corruptData, setCorruptData] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (typeof parsed !== 'object' || parsed === null) {
            setCorruptData(raw);
          }
        } catch {
          setCorruptData(raw);
        }
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

  return (
    <IntegrityErrorBoundary
      fallback={(_error, rawText) => (
        <RecoveryScreen
          rawText={rawText}
          onReset={handleReset}
          onRetry={handleRetry}
        />
      )}
    >
      {children}
    </IntegrityErrorBoundary>
  );
};
