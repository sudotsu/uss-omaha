import React from 'react'
import type { LocationShift as LocationShiftType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { CardSurface } from '@/components/ui/CardSurface'

interface LocationShiftProps {
  data: LocationShiftType
}

export function LocationShift({ data }: LocationShiftProps) {
  return (
    <section id="site-shift" className="section-light section-spacing">
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

          {/* Introduction */}
          <div className="text-center mb-12">
            <p className="text-xl text-slate-deep leading-relaxed max-w-3xl mx-auto">{data.subtitle}</p>
          </div>

          {/* Freedom Park Flood Image */}
          <div className="mb-16">
            <CardSurface variant="light" padding="sm">
              <div className="relative aspect-[16/9] bg-navy/5 rounded-md overflow-hidden">
                <ImageWithFallback
                  src={data.floodImage}
                  alt={data.floodCaption}
                  fill
                  className="object-cover"
                />
              </div>
            </CardSurface>
            <p className="text-center text-slate-deep italic mt-4">{data.floodCaption}</p>
          </div>

          {/* New Location */}
          <CardSurface variant="light" padding="lg" className="mb-12">
            <h3 className="text-navy text-2xl font-serif font-bold mb-4 text-center">{data.newLocationHeading}</h3>
            <div className="h-px bg-brass/30 mb-6 max-w-md mx-auto"></div>
            <p className="text-slate-deep text-lg leading-relaxed text-center max-w-2xl mx-auto">{data.newLocationBody}</p>
          </CardSurface>

          {/* Levi Carter Park Map */}
          <div>
            <CardSurface variant="light" padding="sm">
              <div className="relative aspect-[16/10] bg-navy/5 rounded-md overflow-hidden">
                <ImageWithFallback
                  src={data.mapImage}
                  alt="Levi Carter Park Location Map"
                  fill
                  className="object-contain"
                />
              </div>
            </CardSurface>
          </div>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
