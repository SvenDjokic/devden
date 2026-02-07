import * as React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width variant */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
  /** Add vertical padding */
  py?: 'none' | 'sm' | 'md' | 'lg';
  /** Render as a different element */
  as?: 'div' | 'section' | 'main' | 'article';
}

const maxWidthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const pyStyles = {
  none: '',
  sm: 'py-4',
  md: 'py-6',
  lg: 'py-12',
};

export function Container({
  children,
  maxWidth = '7xl',
  py = 'none',
  as: Component = 'div',
  className = '',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`${maxWidthStyles[maxWidth]} mx-auto w-full px-4 sm:px-6 lg:px-8 ${pyStyles[py]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export type { ContainerProps };
