'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string; alt: string; fill?: boolean; width?: number; height?: number; className?: string; priority?: boolean; sizes?: string; quality?: number; unoptimized?: boolean; onLoad?: () => void
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  return <FallbackImage key={props.src || 'placeholder'} {...props} />
}

function FallbackImage({ src, alt, fill = false, width, height, className = '', priority = false, sizes, quality, unoptimized = false, onLoad }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src)
  const imgSrc = hasError || !src ? '/images/placeholder.svg' : src
  const shared = { className, priority, sizes, quality, unoptimized, onError: () => setHasError(true), onLoad }
  if (fill) return <Image src={imgSrc} alt={alt} fill {...shared} />
  if (width && height) return <Image src={imgSrc} alt={alt} width={width} height={height} {...shared} />
  return <Image src={imgSrc} alt={alt} fill {...shared} />
}
