import React from 'react';
import { Loader2 } from 'lucide-react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all duration-200 ease-out select-none ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px';

const variants = {
  primary: 'bg-nova-600 text-white shadow-nova hover:bg-nova-700 hover:-translate-y-0.5',
  dark: 'bg-ink text-surface hover:bg-navy-2 hover:-translate-y-0.5',
  outline: 'border border-line-strong bg-surface text-ink hover:border-ink hover:bg-paper-2',
  ghost: 'text-ink-soft hover:bg-paper-2 hover:text-ink',
  light: 'bg-surface text-ink hover:bg-white hover:-translate-y-0.5',
  danger: 'border border-bad/30 bg-bad-soft text-bad hover:bg-bad hover:text-white',
};

const sizes = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
