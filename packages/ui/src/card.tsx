import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add padding inside the card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Add shadow to the card */
  shadow?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  padding = 'md',
  shadow = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-lg ${paddingStyles[padding]} ${shadow ? 'shadow-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export type { CardProps };
