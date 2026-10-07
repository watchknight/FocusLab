'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface FeatureErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
  onReset?: () => void;
}

interface FeatureErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FeatureErrorBoundary extends Component<
  FeatureErrorBoundaryProps,
  FeatureErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<FeatureErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Feature error in ${this.props.featureName || 'unnamed component'}:`,
      error,
      errorInfo
    );
  }

  handleRetry = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 flex items-center justify-center w-full">
          <Card className="max-w-md w-full p-6 space-y-4 bg-surface border-border shadow-elevation">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-xs border border-warn text-warn bg-surface-2">
                ⚠ Section Notice
              </span>
              <h2 className="text-lg font-bold tracking-tight text-text">
                {this.props.featureName
                  ? `Issue loading ${this.props.featureName}`
                  : 'Something went wrong in this section'}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                A rendering issue occurred. Your stored focus data and logs remain completely safe.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={this.handleRetry}
              className="w-full min-h-[44px]"
            >
              Try Again
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
