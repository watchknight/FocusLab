import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface-2 py-4 px-4 mb-16 md:mb-0 text-center">
      <p className="text-xs text-muted max-w-prose mx-auto">
        Notice: FocusLab is an educational self-experimentation tool and does not provide medical advice, diagnosis, or treatment.
      </p>
    </footer>
  );
};
