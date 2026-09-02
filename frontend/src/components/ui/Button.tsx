'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const classes = `btn btn-${variant} btn-${size === 'md' ? '' : size}`.trim() + (fullWidth ? ' ' + 'w-full' : '') + (className ? ' ' + className : '');

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      style={{ width: fullWidth ? '100%' : undefined, ...style }}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
    >
      {loading && (
        <div className="spinner" style={{ width: 16, height: 16, borderWidth: '2px', borderTopColor: 'currentColor', borderColor: 'rgba(255,255,255,0.3)' }} />
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  );
}
