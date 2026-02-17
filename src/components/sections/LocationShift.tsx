import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { LocationShift as LocationShiftType } from '@/types/content'

interface LocationShiftProps {
  data: LocationShiftType
  isPrint?: boolean
}

export function LocationShift({ data, isPrint = false }: LocationShiftProps) {
  return (
    <section id="site-shift" className="relative bg-slate-50 py-20 overflow-hidden">
      <Container>
        <div className="max-w-5xl mx-auto relative">

          {/* Vertical Connector Line */}
          <div className="absolute left-[20px] md:left-1/2 top-24 bottom-24 w-0.5 border-l-2 border-dashed border-brass/40 -translate-x-1/2 z-0 hidden md:block"></div>

          {/* Slide 1: Freedom Park Site */}
          <div className="relative z-10 mb-24 md:mb-32">
            <div className="text-center mb-12">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 ring-4 ring-slate-50 shadow-lg">
                1
              </div>
              <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy font-bold text-sm tracking-wider uppercase rounded-full mb-4 border border-navy/20">
                Change Course
              </span>
              <h2 className="text-navy mb-4">{data.heading}</h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-px w-12 bg-brass"></div>
                <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
                <div className="h-px w-12 bg-brass"></div>
              </div>
            </div>

            {/* Content Container */}
            <div className="bg-white p-6 md:p-10 shadow-xl border-t-4 border-brass/50 rounded-sm relative">
              <div className="text-center mb-10">
                <p className="text-xl text-slate-deep leading-relaxed max-w-3xl mx-auto">
                  {data.subtitle}
                </p>
              </div>

              <div className="mb-8">
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
            </div>
          </div>

          {/* Slide 2: Levi Carter Park Site */}
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="w-10 h-10 rounded-full bg-brass text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 ring-4 ring-slate-50 shadow-lg">
                2
              </div>
              <span className="inline-block px-4 py-1.5 bg-brass/20 text-navy font-bold text-sm tracking-wider uppercase rounded-full mb-4 border border-brass/40">
                Our Decision Emerged
              </span>
              <h2 className="text-navy mb-4">{data.newLocationHeading}</h2>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="h-px w-12 bg-brass"></div>
                <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
                <div className="h-px w-12 bg-brass"></div>
              </div>
            </div>

            {/* Content Container */}
            <div className="bg-white p-6 md:p-10 shadow-xl border-t-4 border-brass rounded-sm relative">
              <div className="text-center mb-10">
                <p className="text-xl text-slate-deep leading-relaxed max-w-3xl mx-auto">{data.newLocationBody}</p>
              </div>

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
                {data.mapCaption && (
                  <p className="text-center text-slate-deep italic mt-4">{data.mapCaption}</p>
                )}
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-16 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}
