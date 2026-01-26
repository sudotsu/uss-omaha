'use client'

import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Lightbox } from '@/components/ui/Lightbox'
import type { ExecutionPhotos as ExecutionPhotosType } from '@/types/content'
import { useState } from 'react'

interface ExecutionPhotosProps {
  data: ExecutionPhotosType
}

export function ExecutionPhotos({ data }: ExecutionPhotosProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const lightboxImages = data.photos.map((photo) => ({
    src: photo.src,
    caption: photo.caption,
  }))

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % lightboxImages.length : null
    )
  }

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + lightboxImages.length) % lightboxImages.length : null
    )
  }

  return (
    <section id="execution-photos" className="section-light section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.photos.map((photo, index) => (
              <CardSurface
                key={index}
                variant="light"
                padding="sm"
                interactive
                onClick={() => setSelectedIndex(index)}
                className="group h-full"
              >
                <div className="relative aspect-[4/3] bg-navy/5 overflow-hidden rounded-t-sm">
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-brass text-navy px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        View
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-brass font-bold text-sm mb-1">{photo.year}</div>
                  <p className="text-slate-deep text-sm leading-snug">{photo.caption}</p>
                </div>
              </CardSurface>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>

      {selectedIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  )
}
