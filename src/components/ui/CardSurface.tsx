import React from 'react'

interface CardSurfaceProps {
  children: React.ReactNode
  variant?: 'light' | 'navy' | 'slate'
  interactive?: boolean
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function CardSurface({
  children,
  variant = 'light',
  interactive = false,
  padding = 'md',
  className = '',
  onClick,
}: CardSurfaceProps) {
  const variantStyles = {
    light: 'bg-white text-slate-deep border-brass/10',
    navy: 'bg-navy-dark/30 text-offwhite border-brass/20',
    slate: 'bg-slate-deep/30 text-offwhite border-brass/20',
  }

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const interactiveStyles = interactive
    ? 'hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brass/40 cursor-pointer'
    : ''

  return (
    <div
      className={`
        rounded-lg
        shadow-md
        border-2
        transition-all
        duration-200
        motion-reduce:transition-none
        motion-reduce:transform-none
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${interactiveStyles}
        ${className}
      `.trim()}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
