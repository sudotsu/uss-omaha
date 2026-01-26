import { CardSurface } from '@/components/ui/CardSurface'
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

          <div className="space-y-8">
             {data.milestones.map((milestone, index) => (
               <CardSurface key={index} variant="navy" padding="lg">
                 <div className="flex flex-col md:flex-row md:items-start gap-6">
                   <div className="md:w-32 flex-shrink-0">
                     <span className="inline-block px-3 py-1 border border-brass/30 rounded text-brass font-serif font-bold bg-brass/10">
                       {milestone.date}
                     </span>
                   </div>
                   <div className="flex-1">
                     <h3 className="text-xl text-white font-bold mb-2">{milestone.title}</h3>
                     <p className="text-white/80 leading-relaxed">{milestone.details}</p>
                   </div>
                 </div>
               </CardSurface>
             ))}
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
