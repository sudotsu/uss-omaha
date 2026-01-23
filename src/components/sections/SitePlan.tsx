import { CardSurface } from '@/components/ui/CardSurface'
import { Container } from '@/components/ui/Container'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { SitePlan as SitePlanType } from '@/types/content'

interface SitePlanProps {
  data: SitePlanType
}

export function SitePlan({ data }: SitePlanProps) {
  return (
    <section id="site-plan" className="section-slate section-spacing">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-brass mb-4">{data.heading}</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-12 bg-brass/50"></div>
              <div className="w-1.5 h-1.5 bg-brass rotate-45"></div>
              <div className="h-px w-12 bg-brass/50"></div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-8 space-y-4">
            <p className="text-xl text-offwhite leading-relaxed max-w-3xl mx-auto">
              {data.description}
            </p>
            <p className="text-lg text-offwhite/80 leading-relaxed max-w-2xl mx-auto">
              {data.detail}
            </p>
          </div>

          {/* Site Plan Render */}
          <CardSurface variant="slate" padding="sm" className="mt-12">
            <div className="relative aspect-[16/10] bg-navy/20 rounded-md overflow-hidden">
              <ImageWithFallback
                src={data.renderImage}
                alt={data.heading}
                fill
                className="object-contain"
              />
            </div>
          </CardSurface>

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
