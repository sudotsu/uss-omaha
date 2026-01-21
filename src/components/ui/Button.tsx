import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  download?: boolean
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  download = false
}: ButtonProps) {
  const baseStyles = 'inline-block px-8 py-4 rounded-md font-semibold transition-all duration-200 no-print'
  const variantStyles = {
    primary: 'bg-brass text-navy hover:bg-brass-light hover:shadow-xl',
    secondary: 'bg-navy text-offwhite hover:bg-navy-dark hover:shadow-xl'
  }

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        download={download}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
