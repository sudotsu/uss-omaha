import { Container } from '@/components/ui/Container'
import type { Timeline as TimelineType } from '@/types/content'

interface TimelineProps {
  data: TimelineType
}

export function Timeline({ data }: TimelineProps) {
  return (
    <section id="timeline" className="section-navy section-spacing">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Operational Timeline */}
          <div className="mb-16">
            <h3 className="text-brass-light text-2xl font-serif mb-8 text-center">
              {data.operational.heading}
            </h3>
            <div className="bg-navy-dark/30 rounded-lg p-8 border-2 border-brass/20">
              <ul className="space-y-6">
                {data.operational.events.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-brass rotate-45 group-hover:scale-110 transition-transform duration-200"></div>
                    </div>
                    <p className="text-offwhite text-lg leading-relaxed flex-1">
                      {event.item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Post-Decommissioning Timeline */}
          <div>
            <h3 className="text-brass-light text-2xl font-serif mb-8 text-center">
              {data.postDecommissioning.heading}
            </h3>
            <div className="bg-navy-dark/30 rounded-lg p-8 border-2 border-brass/20">
              <ul className="space-y-6">
                {data.postDecommissioning.events.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-brass rotate-45 group-hover:scale-110 transition-transform duration-200"></div>
                    </div>
                    <p className="text-offwhite text-lg leading-relaxed flex-1">
                      {event.item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass rotate-45"></div>
              <div className="w-2 h-2 bg-brass/75 rotate-45"></div>
              <div className="w-2 h-2 bg-brass/50 rotate-45"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
