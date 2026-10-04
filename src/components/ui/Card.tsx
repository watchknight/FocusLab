import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'bg-surface-2 border border-border rounded-lg p-3 sm:p-4 text-text',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
