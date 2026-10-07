import React from 'react';
import clsx from 'clsx';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'glass-card rounded-[28px] border border-border bg-[var(--glass)] backdrop-blur-[18px] backdrop-saturate-[1.4] p-6 sm:p-8 text-text shadow-elevation',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
