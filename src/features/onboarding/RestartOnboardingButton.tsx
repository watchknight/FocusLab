'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OnboardingModal } from './OnboardingModal';

export const RestartOnboardingButton: React.FC = () => {
  const [resetMessage, setResetMessage] = useState(false);

  const handleRestartOnboarding = () => {
    try {
      localStorage.removeItem('focuslab:onboarded');
    } catch {
      // Ignored
    }
    window.dispatchEvent(new CustomEvent('focuslab:open-onboarding'));
    setResetMessage(true);
  };

  return (
    <div className="flex items-center gap-3">
      <OnboardingModal />
      <Button variant="secondary" onClick={handleRestartOnboarding} className="min-h-[44px]">
        Restart Onboarding Tour
      </Button>
      {resetMessage && (
        <span className="text-xs text-accent font-medium">
          Tour restarted!
        </span>
      )}
    </div>
  );
};
