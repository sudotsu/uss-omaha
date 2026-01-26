'use client'

import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Lightbox } from '@/components/ui/Lightbox'
import type { Gallery as GalleryType } from '@/types/content'
import { useState } from 'react'

interface GalleryProps {
  data: GalleryType
}

export function Gallery({ data }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.images.length)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.images.length) % data.images.length)
  }

  const lightboxImages = data.images.map((image) => ({
    src: image.src,
    caption: image.caption,
  }))

  return (
    <section id="gallery" className="section-light section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.images.map((image, index) => (
              <CardSurface
                key={index}
                variant="light"
                padding="sm"
                interactive
                className="group"
                onClick={() => openLightbox(index)}
                aria-label={`Open image: ${image.caption}`}
              >
                <div className="relative aspect-[4/3] bg-navy/5 rounded-md overflow-hidden mb-4">
                  <ImageWithFallback
                    src={image.src}
                    alt={image.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-deep text-sm leading-relaxed text-center">{image.caption}</p>
              </CardSurface>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  )
}
