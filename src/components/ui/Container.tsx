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
        'w-full mx-auto px-[clamp(16px,4vw,40px)] min-w-0',
        variant === 'prose' ? 'max-w-[720px]' : 'max-w-[1200px]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
