'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  unoptimized?: boolean
  onLoad?: () => void
}

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality,
  unoptimized = false,
  onLoad,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc('/images/placeholder.svg')
    }
  }

  const commonProps = {
    alt,
    className,
    priority,
    sizes,
    quality,
    unoptimized,
    onError: handleError,
    onLoad,
  }

  if (fill) {
    return (
      <Image
        {...commonProps}
        src={imgSrc}
        fill
      />
    )
  }

  if (width && height) {
    return (
      <Image
        {...commonProps}
        src={imgSrc}
        width={width}
        height={height}
      />
    )
  }

  // Fallback to fill if neither width/height provided
  return (
    <Image
      {...commonProps}
      src={imgSrc}
      fill
    />
  )
}
