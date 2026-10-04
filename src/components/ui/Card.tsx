import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`bg-surface-secondary border border-surface-border rounded-lg p-3 sm:p-4 ${className}`}
    >
      {children}
    </Component>
  );
};
