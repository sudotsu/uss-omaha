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
          <div className={`${isPrint ? 'space-y-8' : 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'}`}>
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

            {/* Submarine Image */}
            <div className="page-break-avoid">
              <div className="relative aspect-[4/3] bg-navy/5 rounded-lg overflow-hidden shadow-xl border-2 border-brass/20">
                <ImageWithFallback
                  src={data.image}
                  alt="USS Omaha SSN-692"
                  fill
                  className="object-cover"
                />
                {/* Image Caption Overlay */}
                {!isPrint && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 to-transparent p-4">
                    <p className="text-offwhite text-sm font-serif text-center">
                      {data.heading}
                    </p>
                  </div>
                )}
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
