import { Container } from '@/components/ui/Container'
import type { Background as BackgroundType } from '@/types/content'

interface BackgroundProps {
  data: BackgroundType
  isPrint?: boolean
}

export function Background({ data, isPrint = false }: BackgroundProps) {
  return (
    <section
      className={`section-light ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}
    >
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 page-break-avoid">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-16 page-break-avoid">
            <p className="text-xl text-slate-deep leading-relaxed text-center max-w-3xl mx-auto">
              {data.body}
            </p>
          </div>

          {/* Milestones Timeline */}
          <div className="space-y-8">
            {data.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 page-break-avoid group"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 w-32">
                  <div className="bg-navy text-brass px-4 py-3 rounded-md text-center border-2 border-brass/20 group-hover:border-brass/40 transition-colors duration-200">
                    <div className="text-sm font-serif font-bold uppercase tracking-wider">
                      {milestone.month}
                    </div>
                    <div className="text-2xl font-serif font-bold">
                      {milestone.year}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="flex-1 pt-2">
                  <div className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-brass before:rotate-45">
                    <p className="text-lg text-slate-deep leading-relaxed">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Accent */}
          {!isPrint && (
            <div className="mt-16 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
