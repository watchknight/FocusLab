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
        'rounded-[16px] border border-border bg-surface overflow-hidden flex flex-col text-text shadow-elevation',
        className
      )}
      {...props}
    >
      <div className={clsx('p-5 sm:p-6 flex-1 min-w-0', contentClassName)}>
        {children}
      </div>
      {(caption || tier || meter) && (
        <div className="px-5 py-3 bg-surface-2 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-sm text-muted min-w-0">
          <div className="font-medium min-w-0 w-full sm:w-auto line-clamp-2 sm:line-clamp-none sm:truncate text-text">
            {caption}
          </div>
          <div className="shrink-0">
            {meter ?? (tier ? <EvidenceMeter tier={tier} /> : null)}
          </div>
        </div>
      )}
    </Component>
  );
};

export default Plate;
