import React from 'react';
import clsx from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: 'default' | 'prose';
  children?: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  variant = 'default',
  children,
  className,
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'w-full mx-auto px-[clamp(20px,5vw,72px)] min-w-0',
        variant === 'prose' ? 'max-w-[720px]' : 'max-w-[1320px]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
