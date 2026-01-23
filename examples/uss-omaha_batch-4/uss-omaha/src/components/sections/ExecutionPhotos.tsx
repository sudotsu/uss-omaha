'use client'

import React, { useState } from 'react'
import type { ExecutionPhotos as ExecutionPhotosType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { CardSurface } from '@/components/ui/CardSurface'
import { Lightbox } from '@/components/ui/Lightbox'

interface ExecutionPhotosProps {
  data: ExecutionPhotosType
}

export function ExecutionPhotos({ data }: ExecutionPhotosProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const lightboxImages = data.photos.map((photo) => ({
    src: photo.src,
    caption: `${photo.caption} (${photo.year})`,
  }))

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.photos.length)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.photos.length) % data.photos.length)
  }

  return (
    <section id="execution-photos" className="section-navy section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.photos.map((photo, index) => (
              <CardSurface
                key={index}
                variant="navy"
                padding="sm"
                interactive
                onClick={() => openLightbox(index)}
                className="group"
              >
                <div className="relative aspect-[4/3] bg-navy-dark/50 rounded-md overflow-hidden mb-4">
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 bg-brass text-navy px-3 py-1 rounded-md font-serif font-bold text-sm">
                    {photo.year}
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-brass/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-offwhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-offwhite text-sm leading-relaxed">{photo.caption}</p>
              </CardSurface>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox */}
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
