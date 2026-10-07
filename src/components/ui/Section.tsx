import React from 'react';
import clsx from 'clsx';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  as: Component = 'section',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'w-full py-[clamp(88px,12vw,192px)] relative min-w-0',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Section;
