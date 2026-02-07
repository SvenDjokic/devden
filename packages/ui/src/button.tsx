import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional icon to render before children */
  icon?: React.ReactNode;
  /** If true, only renders the icon (for icon-only buttons) */
  iconOnly?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconOnly = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium',
    secondary: 'bg-card border border-border text-foreground hover:bg-muted rounded-lg font-medium',
    ghost: 'bg-transparent text-foreground hover:bg-muted rounded-lg font-medium',
    text: 'bg-transparent text-muted-foreground hover:text-foreground',
    icon: 'bg-transparent text-muted-foreground hover:text-foreground rounded-md',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: iconOnly ? 'p-1.5' : 'px-3 py-1.5 text-sm gap-1.5',
    md: iconOnly ? 'p-2' : 'px-4 py-2 text-sm gap-2',
    lg: iconOnly ? 'p-3' : 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {!iconOnly && children}
    </button>
  );
}

export type { ButtonProps, ButtonVariant, ButtonSize };
