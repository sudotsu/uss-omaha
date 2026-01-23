import React from 'react'
import type { Close as CloseType } from '@/types/content'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { CardSurface } from '@/components/ui/CardSurface'

interface CloseProps {
  data: CloseType
}

export function Close({ data }: CloseProps) {
  return (
    <section id="close" className="section-light section-spacing">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
            <p className="text-brass text-xl font-serif mt-6 uppercase tracking-wide">{data.subheading}</p>
          </div>

          <CardSurface variant="light" padding="lg" className="mb-12 text-center">
            <h3 className="text-navy text-2xl font-serif font-bold mb-6">{data.contactInfo.organization}</h3>
            <div className="space-y-3">
              <p className="text-slate-deep">
                <a
                  href={`https://${data.contactInfo.website}`}
                  className="text-brass hover:text-brass-light text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brass/40 rounded px-2 py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.contactInfo.website}
                </a>
              </p>
              <p className="text-slate-deep font-medium">Contact: {data.contactInfo.contact}</p>
            </div>
          </CardSurface>

          <div className="text-center mb-12">
            <p className="text-navy text-3xl font-serif font-bold italic">{data.tagline}</p>
          </div>

          <div className="relative aspect-[16/9] bg-navy/5 rounded-lg overflow-hidden shadow-xl border-2 border-brass/20">
            <ImageWithFallback src={data.finalImage} alt="USS Omaha SSN-692" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
            <div className="absolute bottom-8 inset-x-0 text-center">
              <p className="text-brass text-2xl font-serif font-bold">USS Omaha SSN-692 Memorial</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
