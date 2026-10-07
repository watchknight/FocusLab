import React from 'react';
import clsx from 'clsx';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'grid grid-cols-12 gap-[clamp(16px,2.2vw,32px)] w-full',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Grid;
