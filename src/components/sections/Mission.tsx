import { Container } from '@/components/ui/Container'
import type { Mission as MissionType } from '@/types/content'

interface MissionProps {
  data: MissionType
  isPrint?: boolean
}

export function Mission({ data, isPrint = false }: MissionProps) {
  return (
    <section
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
          <div className="relative">
            {/* Decorative Quote Mark */}
            {!isPrint && (
              <div className="absolute -left-4 -top-4 text-8xl text-brass/20 font-serif leading-none">
                &ldquo;
              </div>
            )}

            <p className="text-xl md:text-2xl text-slate-deep leading-relaxed text-center relative z-10">
              {data.body}
            </p>

            {!isPrint && (
              <div className="absolute -right-4 -bottom-4 text-8xl text-brass/20 font-serif leading-none">
                &rdquo;
              </div>
            )}
          </div>

          {/* Accent Line */}
          <div className="mt-12 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brass to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
