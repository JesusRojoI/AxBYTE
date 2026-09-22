'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'peach' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: string;
  iconRight?: boolean;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: {
    bg: '#1A1A1A',
    color: '#FFFFFF',
    border: 'none',
    bgHover: '#E89B7A',
    colorHover: '#FFFFFF',
  },
  secondary: {
    bg: '#FFFFFF',
    color: '#1A1A1A',
    border: '1px solid rgba(128,128,128,0.2)',
    bgHover: 'rgba(245,199,177,0.15)',
    colorHover: '#1A1A1A',
  },
  ghost: {
    bg: 'transparent',
    color: '#1A1A1A',
    border: 'none',
    bgHover: 'rgba(245,199,177,0.2)',
    colorHover: '#1A1A1A',
  },
  dark: {
    bg: '#1A1A1A',
    color: '#FFFFFF',
    border: 'none',
    bgHover: '#2A2A2A',
    colorHover: '#FFFFFF',
  },
  peach: {
    bg: '#F5C7B1',
    color: '#1A1A1A',
    border: 'none',
    bgHover: '#E89B7A',
    colorHover: '#FFFFFF',
  },
  sage: {
    bg: '#D9F0D3',
    color: '#1A1A1A',
    border: 'none',
    bgHover: '#B5DFA8',
    colorHover: '#1A1A1A',
  },
};

const SIZES = {
  sm: { padding: '8px 16px', fontSize: '14px' },
  md: { padding: '12px 24px', fontSize: '14px' },
  lg: { padding: '16px 32px', fontSize: '16px' },
};

export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
  icon,
  iconRight,
  fullWidth,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant];
  const s = SIZES[size];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hovered ? '12px' : '8px',
    fontWeight: 600,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'inherit',
    textDecoration: 'none',
    backgroundColor: hovered && !disabled ? v.bgHover : v.bg,
    color: hovered && !disabled ? v.colorHover : v.color,
    border: v.border,
    transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered && !disabled
      ? '0 10px 30px -10px rgba(26,26,26,0.3)'
      : 'none',
  };

  const content = (
    <>
      {icon && !iconRight && (
        <i
          className={`bi ${icon}`}
          style={{
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      )}
      <span>{children}</span>
      {icon && iconRight && (
        <i
          className={`bi ${icon}`}
          style={{
            transition: 'transform 0.3s',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        />
      )}
    </>
  );

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <Link href={href} className={className} style={style} {...handlers}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      {...handlers}
    >
      {content}
    </button>
  );
}