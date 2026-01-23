import React from 'react'

type Variant = 'light' | 'navy' | 'slate'
type Padding = 'sm' | 'md' | 'lg'

export interface CardSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  interactive?: boolean
  padding?: Padding
}

/**
 * CardSurface
 * A single, consistent surface component for all “card” UI.
 * - Default state is visibly separated from background (border + shadow).
 * - Optional interactive mode adds hover lift and focus ring.
 */
export function CardSurface({
  children,
  variant = 'light',
  interactive = false,
  padding = 'md',
  className = '',
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ...rest
}: CardSurfaceProps) {
  const variantStyles: Record<Variant, string> = {
    // Light on offwhite background needs definition.
    light: 'bg-white text-slate-deep border-slate-200/70',
    navy: 'bg-navy-dark/35 text-offwhite border-brass/20',
    slate: 'bg-slate-deep/35 text-offwhite border-brass/20',
  }

  const paddingStyles: Record<Padding, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const isClickable = typeof onClick === 'function'
  const isInteractive = interactive || isClickable

  const interactiveStyles = isInteractive
    ? 'hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-brass/40 cursor-pointer'
    : ''

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    onKeyDown?.(e)
    if (!isClickable) return
    if (e.defaultPrevented) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Trigger the same click handler for keyboard users.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick?.(e as any)
    }
  }

  return (
    <div
      {...rest}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (isClickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isClickable ? 0 : undefined)}
      className={`
        rounded-lg
        border
        shadow-lg
        transition-all
        duration-200
        transform-gpu
        motion-reduce:transition-none
        motion-reduce:transform-none
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${interactiveStyles}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}
