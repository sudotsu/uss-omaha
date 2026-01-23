'use client'

import { useCallback, useEffect } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

interface LightboxProps {
  images: Array<{ src: string; caption: string }>
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const current = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-offwhite hover:text-brass transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-brass rounded"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 text-offwhite hover:text-brass transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-brass rounded"
          aria-label="Previous image"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-[90vh] mx-auto px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10]">
          <ImageWithFallback
            src={current.src}
            alt={current.caption}
            fill
            className="object-contain"
          />
        </div>
        <p className="text-offwhite text-center mt-4 text-lg">
          {current.caption}
        </p>
        <p className="text-brass/60 text-center text-sm mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 text-offwhite hover:text-brass transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-brass rounded"
          aria-label="Next image"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
