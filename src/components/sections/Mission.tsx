import { Container } from '@/components/ui/Container'
import type { Mission as MissionType } from '@/types/content'
import Image from 'next/image'

interface MissionProps {
  data: MissionType
  isPrint?: boolean
}

export function Mission({ data, isPrint = false }: MissionProps) {
  return (
    <section
      id="mission"
      className={`section-light ${isPrint ? 'section-spacing-tight' : 'section-spacing'} page-break-avoid`}
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          {/* Mission Statement */}
          {/* Mission Statement and Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
            {/* Text Side */}
            <div className="relative order-2 md:order-1">
              {/* Decorative Quote Mark */}
              {!isPrint && (
                <div className="absolute -left-4 -top-4 text-8xl text-brass/20 font-serif leading-none">
                  &ldquo;
                </div>
              )}

              <p className="text-xl md:text-2xl text-slate-deep leading-relaxed text-center md:text-left relative z-10">
                {data.statement}
              </p>

              {!isPrint && (
                <div className="absolute -right-4 -bottom-4 text-8xl text-brass/20 font-serif leading-none">
                  &rdquo;
                </div>
              )}
            </div>

            {/* Image Side (Patch) */}
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 drop-shadow-xl animate-float">
                <Image
                  src="/images/logos/uss-omaha-patch.jpg"
                  alt="USS Omaha Patch"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Accent Line */}
          {data.highlights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {data.highlights.map((highlight, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-brass rotate-45 mb-4"></div>
                  <span className="text-lg font-medium tracking-wide uppercase text-brass">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
        </div>
      </Container>
    </section>
  )
}
