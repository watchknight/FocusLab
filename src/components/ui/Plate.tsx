import React from 'react';
import clsx from 'clsx';
import { EvidenceMeter, EvidenceTier } from './EvidenceMeter';

export interface PlateProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article';
  tier?: EvidenceTier;
  caption?: React.ReactNode;
  meter?: React.ReactNode;
  contentClassName?: string;
}

export const Plate: React.FC<PlateProps> = ({
  children,
  className,
  as: Component = 'div',
  tier,
  caption,
  meter,
  contentClassName,
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'rounded-md border border-border bg-surface-2 overflow-hidden flex flex-col text-text shadow-elevation',
        className
      )}
      {...props}
    >
      <div className={clsx('p-4 sm:p-5 flex-1 min-w-0', contentClassName)}>
        {children}
      </div>
      {(caption || tier || meter) && (
        <div className="px-4 py-2.5 bg-surface border-t border-border flex items-center justify-between gap-3 text-xs text-muted min-w-0">
          <div className="truncate font-medium">{caption}</div>
          <div className="shrink-0">
            {meter ?? (tier ? <EvidenceMeter tier={tier} /> : null)}
          </div>
        </div>
      )}
    </Component>
  );
};

export default Plate;
