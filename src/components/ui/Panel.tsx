import React from 'react';
import clsx from 'clsx';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
  variant?: 'surface' | 'surface-2';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className,
  as: Component = 'div',
  variant = 'surface-2',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'rounded-md border border-border p-4 sm:p-5 text-text shadow-elevation',
        variant === 'surface' ? 'bg-surface' : 'bg-surface-2',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Panel;
