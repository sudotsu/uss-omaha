import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { LocationShift as LocationShiftType } from '@/types/content'

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
            <p className="text-xl text-slate-deep leading-relaxed max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          </div>

          {/* Freedom Park Flood Image */}
          <div className="mb-16">
            <div className="relative aspect-[16/9] bg-navy/5 rounded-lg overflow-hidden shadow-xl border-2 border-brass/20">
              <ImageWithFallback
                src={data.floodImage}
                alt={data.floodCaption}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center text-slate-deep italic mt-4">
              {data.floodCaption}
            </p>
          </div>

          {/* New Location */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-brass/10">
            <h3 className="text-navy text-2xl font-serif font-bold mb-4 text-center">
              {data.newLocationHeading}
            </h3>
            <div className="h-px bg-brass/30 mb-6 max-w-md mx-auto"></div>
            <p className="text-slate-deep text-lg leading-relaxed text-center max-w-2xl mx-auto">
              {data.newLocationBody}
            </p>
          </div>

          {/* Levi Carter Park Map */}
          <div>
            <div className="relative aspect-[16/10] bg-navy/5 rounded-lg overflow-hidden shadow-xl border-2 border-brass/20">
              <ImageWithFallback
                src={data.mapImage}
                alt="Levi Carter Park Location Map"
                fill
                className="object-contain"
              />
            </div>
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
