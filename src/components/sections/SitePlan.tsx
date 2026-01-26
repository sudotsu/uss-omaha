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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <p className="text-offwhite text-xl leading-relaxed font-serif">
                {data.description}
              </p>

              <CardSurface variant="navy" padding="md" className="border-l-4 border-brass">
                <p className="text-offwhite/90 italic">{data.detail}</p>
              </CardSurface>
            </div>

            {/* Render Image */}
            <div className="relative">
              <CardSurface variant="navy" padding="sm" className="bg-navy-dark/50">
                <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-md border border-brass/20">
                  <ImageWithFallback
                    src={data.renderImage}
                    alt="Site Plan Rendering"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </CardSurface>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-brass/30 rounded-tr-3xl hidden md:block"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-brass/30 rounded-bl-3xl hidden md:block"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
