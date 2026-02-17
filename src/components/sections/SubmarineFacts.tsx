import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { SubmarineFacts as SubmarineFactsType } from '@/types/content'

interface SubmarineFactsProps {
  data: SubmarineFactsType
  isPrint?: boolean
}

export function SubmarineFacts({ data, isPrint = false }: SubmarineFactsProps) {
  return (
    <section
      className={`section-light ${isPrint ? 'section-spacing-tight' : 'section-spacing'}`}
    >
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 page-break-avoid">
            <h2 className="text-navy mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass"></div>
            </div>
          </div>

          {/* Content Layout */}
          <div className="max-w-3xl mx-auto">
            {/* Facts Table */}
            <div className="page-break-avoid">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-brass/10">
                <div className="divide-y divide-neutral-light/30">
                  {data.facts.map((fact, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4 p-4 hover:bg-brass/5 transition-colors duration-200"
                    >
                      <div className="font-serif font-bold text-navy text-sm uppercase tracking-wide">
                        {fact.label}
                      </div>
                      <div className="text-slate-deep font-medium">
                        {fact.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
